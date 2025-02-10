import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMeal, getOffers } from "../services/firebase";
import { Meal } from "../models/Meal";
import { Offer } from "../models/Offer";
import { DateTime } from "luxon";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FoodComponent } from "../models/FoodComponent";

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

  function Row({
    offers,
    foodComponentName,
  }: {
    offers: Offer[];
    foodComponentName: FoodComponent;
  }) {
    const [open, setOpen] = useState(false);
    const firstOffer = offers[0];
    const remainingOffers = offers;

    return (
      <React.Fragment>
        {/* Main row (first occurrence) */}
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <a
              className="font-medium text-blue-700 dark:text-blue-500 hover:underline"
              href={`https://etilbudsavis.dk/${firstOffer.store}/tilbudsaviser/${firstOffer.catelogid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {foodComponentName.items}
            </a>
          </TableCell>
          <TableCell align="right">
            {firstOffer.price} {firstOffer.priceCurrency}
          </TableCell>
          <TableCell align="right">
            {firstOffer.weight} {firstOffer.weightUnit}
          </TableCell>
          <TableCell align="right">
            {DateTime.fromISO(firstOffer.offerStart).toFormat("yyyy-MM-dd")}
          </TableCell>
          <TableCell align="right">
            {DateTime.fromISO(firstOffer.offerEnd).toFormat("yyyy-MM-dd")}
          </TableCell>
          <TableCell align="right">{firstOffer.store}</TableCell>
        </TableRow>

        {/* Expandable row for remaining offers */}
        {remainingOffers.length > 0 && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    More Offers for {firstOffer.name}
                  </Typography>
                  <Table size="small" aria-label="additional offers">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Offer Start</TableCell>
                        <TableCell>Offer End</TableCell>
                        <TableCell>Store</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {remainingOffers.map((offer, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <a
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              href={`https://etilbudsavis.dk/${offer.store}/tilbudsaviser/${offer.catelogid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {offer.name ?? "Unknown"}
                            </a>
                          </TableCell>
                          <TableCell>
                            {offer.price} {offer.priceCurrency}
                          </TableCell>
                          <TableCell>
                            {offer.weight} {offer.weightUnit}
                          </TableCell>
                          <TableCell>
                            {DateTime.fromISO(offer.offerStart).toFormat(
                              "yyyy-MM-dd"
                            )}
                          </TableCell>
                          <TableCell>
                            {DateTime.fromISO(offer.offerEnd).toFormat(
                              "yyyy-MM-dd"
                            )}
                          </TableCell>
                          <TableCell>{offer.store}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  }

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
