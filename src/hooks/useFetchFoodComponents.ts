import { useEffect, useState } from "react";
import { getFoodComponents} from "../services/firebase";
import { FoodComponent } from "../models/FoodComponent";

// Custom hook til at hente tilbud
export const getFoodComponents = (realTime: boolean = false) => {
    const [offers, setOffers] = useState<FoodComponent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getOffers()
            .then((data) => setOffers(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        
    }, [realTime]);

    return { offers, loading, error };
};
