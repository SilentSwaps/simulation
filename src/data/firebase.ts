// Import the functions you need from the SDKs you need
import {
	addDoc, collection, query, orderBy, limit, getFirestore, DocumentData, QueryDocumentSnapshot,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import * as geofire from "geofire-common";
import { Question } from "../types";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyApgq3Kg5VGNwFHdOujvnRDFhkrtikbId8",
	authDomain: "geolocation-abfa8.firebaseapp.com",
	projectId: "geolocation-abfa8",
	storageBucket: "geolocation-abfa8.appspot.com",
	messagingSenderId: "783069766861",
	appId: "1:783069766861:web:0c22b66596c9b8a6a3b584",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const converter = <T extends { id: string }>() => ({
	toFirestore: (d: T) => {
		const { id, ...data } = d;
		return data;
	},
	fromFirestore: (snapshot: QueryDocumentSnapshot) => {
		const data = snapshot.data();
		return {
			...data,
			id: snapshot.id,
		} as T;
	},
});

const collectionRef = <T extends DocumentData & { id: string }>(path: string) =>
	collection(db, path).withConverter(converter<T>());

export const collections = { questions: collectionRef<Question>("questions") };
