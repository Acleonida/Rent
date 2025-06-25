import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  GeoPoint as FirestoreGeoPoint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config';
import { Item, ItemSearchFilters, ItemForm, GeoPoint, ItemCategory } from '../../shared/types';
import { calculateDistance } from '../../shared/utils';

// Create new item
export const createItem = async (itemData: ItemForm, userId: string): Promise<Item> => {
  try {
    // Upload images
    const imageUrls = await Promise.all(
      itemData.images.map(async (file, index) => {
        const imageRef = ref(storage, `items/${userId}/${Date.now()}_${index}`);
        const snapshot = await uploadBytes(imageRef, file);
        return getDownloadURL(snapshot.ref);
      })
    );

    // Create Firestore GeoPoint
    const location = new FirestoreGeoPoint(
      itemData.location.latitude,
      itemData.location.longitude
    );

    const item: Omit<Item, 'id' | 'lessor' | 'createdAt' | 'updatedAt' | 'rating' | 'totalReviews' | 'viewCount'> = {
      title: itemData.title,
      description: itemData.description,
      category: itemData.category,
      subcategory: itemData.subcategory,
      price: itemData.price,
      priceType: itemData.priceType,
      images: imageUrls,
      location: itemData.location,
      address: itemData.address,
      city: itemData.city,
      province: 'Davao del Sur',
      lessorId: userId,
      isAvailable: true,
      isVerified: false,
      tags: itemData.tags,
      specifications: itemData.specifications,
      deposit: itemData.deposit,
      minimumRentalPeriod: itemData.minimumRentalPeriod,
      maximumRentalPeriod: itemData.maximumRentalPeriod
    };

    const docRef = await addDoc(collection(db, 'items'), {
      ...item,
      location,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      totalReviews: 0,
      viewCount: 0
    });

    return { id: docRef.id, ...item, rating: 0, totalReviews: 0, viewCount: 0 };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create item');
  }
};

// Get item by ID
export const getItemById = async (itemId: string): Promise<Item | null> => {
  try {
    const itemDoc = await getDoc(doc(db, 'items', itemId));
    if (itemDoc.exists()) {
      const data = itemDoc.data();
      return {
        id: itemDoc.id,
        ...data,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude
        }
      } as Item;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get item');
  }
};

// Update item
export const updateItem = async (
  itemId: string,
  updates: Partial<ItemForm>,
  userId: string
): Promise<Item> => {
  try {
    const itemRef = doc(db, 'items', itemId);
    const itemDoc = await getDoc(itemRef);
    
    if (!itemDoc.exists()) {
      throw new Error('Item not found');
    }
    
    if (itemDoc.data().lessorId !== userId) {
      throw new Error('Not authorized to update this item');
    }

    const updateData: any = {
      ...updates,
      updatedAt: new Date()
    };

    // Handle new images if provided
    if (updates.images && updates.images.length > 0) {
      const newImageUrls = await Promise.all(
        updates.images.map(async (file, index) => {
          const imageRef = ref(storage, `items/${userId}/${Date.now()}_${index}`);
          const snapshot = await uploadBytes(imageRef, file);
          return getDownloadURL(snapshot.ref);
        })
      );
      
      updateData.images = newImageUrls;
    }

    // Handle location update
    if (updates.location) {
      updateData.location = new FirestoreGeoPoint(
        updates.location.latitude,
        updates.location.longitude
      );
    }

    await updateDoc(itemRef, updateData);
    
    const updatedItem = await getItemById(itemId);
    if (!updatedItem) {
      throw new Error('Failed to get updated item');
    }
    
    return updatedItem;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update item');
  }
};

// Delete item
export const deleteItem = async (itemId: string, userId: string): Promise<void> => {
  try {
    const itemRef = doc(db, 'items', itemId);
    const itemDoc = await getDoc(itemRef);
    
    if (!itemDoc.exists()) {
      throw new Error('Item not found');
    }
    
    if (itemDoc.data().lessorId !== userId) {
      throw new Error('Not authorized to delete this item');
    }

    // Delete images from storage
    const images = itemDoc.data().images || [];
    await Promise.all(
      images.map(async (imageUrl: string) => {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Failed to delete image:', error);
        }
      })
    );

    await deleteDoc(itemRef);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete item');
  }
};

// Search items with filters
export const searchItems = async (
  filters: ItemSearchFilters,
  userLocation?: GeoPoint,
  page: number = 1,
  pageSize: number = 20
): Promise<{ items: Item[]; total: number }> => {
  try {
    let q = collection(db, 'items');
    const constraints: any[] = [];

    // Apply filters
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    
    if (filters.subcategory) {
      constraints.push(where('subcategory', '==', filters.subcategory));
    }
    
    if (filters.availability !== undefined) {
      constraints.push(where('isAvailable', '==', filters.availability));
    }
    
    if (filters.priceRange) {
      constraints.push(where('price', '>=', filters.priceRange.min));
      constraints.push(where('price', '<=', filters.priceRange.max));
    }

    // Always filter by province (Davao del Sur)
    constraints.push(where('province', '==', 'Davao del Sur'));

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_low_to_high':
          constraints.push(orderBy('price', 'asc'));
          break;
        case 'price_high_to_low':
          constraints.push(orderBy('price', 'desc'));
          break;
        case 'rating':
          constraints.push(orderBy('rating', 'desc'));
          break;
        case 'newest':
          constraints.push(orderBy('createdAt', 'desc'));
          break;
        case 'oldest':
          constraints.push(orderBy('createdAt', 'asc'));
          break;
        case 'popularity':
          constraints.push(orderBy('viewCount', 'desc'));
          break;
      }
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    // Apply pagination
    constraints.push(limit(pageSize));
    if (page > 1) {
      // This is a simplified pagination - in production, you'd use startAfter with the last document
      constraints.push(limit((page - 1) * pageSize));
    }

    const querySnapshot = await getDocs(query(q, ...constraints));
    const items: Item[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const item: Item = {
        id: doc.id,
        ...data,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude
        }
      } as Item;

      // Calculate distance if user location is provided
      if (userLocation && filters.sortBy === 'distance') {
        const distance = calculateDistance(userLocation, item.location);
        (item as any).distance = distance;
      }

      items.push(item);
    });

    // Sort by distance if needed
    if (userLocation && filters.sortBy === 'distance') {
      items.sort((a, b) => (a as any).distance - (b as any).distance);
    }

    // Filter by radius if location and radius are provided
    let filteredItems = items;
    if (userLocation && filters.radius) {
      filteredItems = items.filter(item => {
        const distance = calculateDistance(userLocation, item.location);
        return distance <= filters.radius!;
      });
    }

    return {
      items: filteredItems,
      total: filteredItems.length // This is simplified - in production, you'd get the total count separately
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search items');
  }
};

// Get items by lessor
export const getItemsByLessor = async (lessorId: string): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, 'items'),
      where('lessorId', '==', lessorId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const items: Item[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude
        }
      } as Item);
    });

    return items;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get items by lessor');
  }
};

// Get items by category
export const getItemsByCategory = async (category: ItemCategory): Promise<Item[]> => {
  try {
    const q = query(
      collection(db, 'items'),
      where('category', '==', category),
      where('isAvailable', '==', true),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    const items: Item[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude
        }
      } as Item);
    });

    return items;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get items by category');
  }
};

// Increment view count
export const incrementViewCount = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, 'items', itemId);
    await updateDoc(itemRef, {
      viewCount: increment(1)
    });
  } catch (error: any) {
    console.error('Failed to increment view count:', error);
  }
}; 