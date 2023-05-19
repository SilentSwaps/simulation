import {
	doc,
	setDoc,
	addDoc,
	CollectionReference,
	WithFieldValue,
	getDocs,
	query,
	deleteDoc,
	getDoc,
	QueryConstraint,
} from "firebase/firestore";

/**
 * Gets all documents in a collection
 * @param `reference` - reference to a collection.
 */
export const getCollections = async<T>(
	reference: CollectionReference<T>,
): Promise<T[]> => {
	const snapshot = await getDocs(reference);
	return new Promise((resolve, reject) => {
		!snapshot.empty
			? resolve(snapshot.docs.map(d => d.data()) as T[])
			: reject("Couldn't get collections");
	});
};

/**
 * Filter conditions in a clause are specified using the
 * strings '&lt;', '&lt;=', '==', '!=', '&gt;=', '&gt;', 'array-contains', 'in',
 * 'array-contains-any', and 'not-in'.
 * @param `reference` - reference to a collection.
 * @param `contraints` - constraints.
 */
export const getCollectionsWithFilter = async<T>(
	reference: CollectionReference<T>,
	constraints: QueryConstraint[],
): Promise<T[]> => {
	const snapshot = await getDocs(query(reference, ...constraints));
	return new Promise((resolve, reject) => {
		!snapshot.empty
			? resolve(snapshot.docs.map(d => d.data()) as T[])
			: reject("Couldn't get collections");
	});
};

/**
 * Gets single document from collection
 * @param `reference` - reference to a collection.
 * @param `id` - the id to a document.
 */
export const getDocument = async<T>(
	reference: CollectionReference<T>,
	id: string,
) => getDoc(doc(reference, id));

/**
 * Adds data to specific collection
 * @param `reference` - reference to a collection.
 * @param `data` - data to be added.
 */
export const addDocument = async<T>(
	reference: CollectionReference<T>,
	data: WithFieldValue<T>,
) => {
	return addDoc(reference, data);
};

/**
 * Updates data of specific collection.
 * Creates a new document if given document by id does not exist
 * @param `reference` - reference to a collection.
 * @param `id` - id of a document.
 * @param `data` - data to be added.
 */
export const setDocument = async<T>(
	reference: CollectionReference<T>,
	id: string,
	data: WithFieldValue<T>,
) => setDoc(doc(reference, id), data);

/**
 * Deletes a specific document.
 * @param `reference` - reference to a collec*tion.
 * @param `id` - id of a document.
 */
export const deleteDocument = async<T>(
	reference: CollectionReference<T>,
	id: string,
) => deleteDoc(doc(reference, id));
