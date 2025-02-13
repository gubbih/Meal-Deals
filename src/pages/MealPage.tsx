import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMeal, getOffers } from "../services/firebase";
import { Meal } from "../models/Meal";
import { Offer } from "../models/Offer";
//F:\Meal Deals\src\Component\TableRows.tsx
import { Row } from "../components/TableRows";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

function MealPage() {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [groupedOffers, setGroupedOffers] = useState<Record<string, Offer[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const mealData = await getMeal(id);
        setMeal(mealData);
        const offersData = await getOffers();
        setOffers(offersData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!meal?.foodComponents || offers.length === 0) return;

    const grouped: Record<string, Offer[]> = {};

    meal.foodComponents.forEach((fc) => {
      if (!fc?.category || !fc?.items) return;

      // Convert `fc.items` to an array if it's a string
      const foodItems = Array.isArray(fc.items) ? fc.items : [fc.items];

      // Find offers that match either the category OR specific food items
      const matchedOffers = offers.filter((offer) =>
        (offer.matchedItems ?? []).some((item) => foodItems.includes(item))
      );

      matchedOffers.forEach((offer) => {
        if (!grouped[offer.name]) {
          grouped[offer.name] = [];
        }
        // Prevent duplicate offers based on name and price
        if (
          !grouped[offer.name].some(
            (o) => o.price === offer.price && o.name === offer.name
          )
        ) {
          grouped[offer.name].push(offer);
        }
      });
    });
    // Sort each group by price (lowest to highest)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.price - b.price);
    });
    setGroupedOffers(grouped);
  }, [meal, offers]);

  if (loading || !meal) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{meal.name}</h1>
      <img src={meal.imagePath} alt={meal.name} className="mb-4" />
      <p>{meal.description}</p>
      <p>{meal.category}</p>
      <p>{meal.cuisine}</p>
      <p>Ting der skal bruges:</p>
      <ul>
        {meal.foodComponents.map((fc, index) => (
          <li key={index}>
            {fc.category} - {fc.items}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h2 className="text-2xl font-bold">Ingredients & Offers</h2>

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Ingredient</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Weight</TableCell>
                <TableCell align="right">Offer Start</TableCell>
                <TableCell align="right">Offer End</TableCell>
                <TableCell align="right">Store</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meal.foodComponents.map((fc, index) => {
                // Ensure `fc.items` is always an array
                const foodItems = Array.isArray(fc.items)
                  ? fc.items
                  : [fc.items];

                // Group offers based on `matchedItems`
                const groupedOffers: Record<string, Offer[]> = {};
                console.log(groupedOffers);
                offers.forEach((offer) => {
                  if (
                    (offer.matchedItems ?? []).some((item) =>
                      foodItems.includes(item)
                    )
                  ) {
                    // Use the first matched item as the group key
                    const key =
                      (offer.matchedItems ?? []).find((item) =>
                        foodItems.includes(item)
                      ) || offer.name;
                    if (!groupedOffers[key]) {
                      groupedOffers[key] = [];
                    }
                    groupedOffers[key].push(offer);
                  }
                });

                return (
                  <React.Fragment key={index}>
                    {Object.keys(groupedOffers).length > 0 ? (
                      Object.entries(groupedOffers).map(([name, meal], idx) => (
                        <Row
                          key={`${index}-${idx}`}
                          offers={groupedOffers[name]}
                          foodComponentName={fc}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell />
                        <TableCell component="th" scope="row">
                          {foodItems.join(", ")}
                        </TableCell>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary">
                            Ikke på tilbud lige nu
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default MealPage;
