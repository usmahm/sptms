import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "@/utils/firebase";
import { TRIP } from "@/types";

export const getTripById = async (tripId: string): Promise<TRIP | null> => {
  let trip: TRIP | null = null;

  try {
    const tripRef = doc(firebaseDb, "trips", tripId);
    const docSnapshot = await getDoc(tripRef);
  
    if (docSnapshot.exists()) {
      trip = {
        ...docSnapshot.data() as TRIP,
        id: docSnapshot.id,
      };
    }
  } catch (err) {
    console.log("HEYYYY ERR111", err);
  }

  return trip;
}