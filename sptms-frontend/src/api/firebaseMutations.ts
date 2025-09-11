import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { firebaseDb } from "@/utils/firebase";
import { LAT_LNG_TYPE } from "@/types";

// export const createBusStop = async (
//   busStop: {
//     location: LAT_LNG_TYPE;
//     name: string;
//   }
// ) => {
//   try {
//     const respo = await addDoc(
//       collection(firebaseDb, "bus_stops"),
//       busStop
//     );

//     console.log("HEYYY 666", respo);
//   } catch (err) {
//     console.log("HEYYYY ERR111", err);
//   }
// }

export const createTrip = async (
  tripId: string,
  tripRoute: {
    expected_path: LAT_LNG_TYPE[];
  }
) => {
  try {
    const respo = await setDoc(doc(firebaseDb, "trips", tripId), tripRoute, {
      merge: true
    });

    console.log("HEYYY 666", respo);
  } catch (err) {
    console.log("HEYYYY ERR111", err);
  }
};
