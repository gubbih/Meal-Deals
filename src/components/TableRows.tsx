import React, { useState } from "react";
import { DateTime } from "luxon";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Offer } from "../models/Offer";
import { FoodComponent } from "../models/FoodComponent";

export function Row({
  offers,
  foodComponentName,
}: {
  offers: Offer[];
  foodComponentName: FoodComponent | { category: string; items: string };
}) {
  const [open, setOpen] = useState(false);

  // Make sure we have at least one offer
  if (!offers || offers.length === 0) {
    return null;
  }

  const firstOffer = offers[0];
  const remainingOffers = offers.slice(1); // Get all offers except the first one

  // Get the item name to display
  const itemName =
    typeof foodComponentName.items === "string"
      ? foodComponentName.items
      : Array.isArray(foodComponentName.items) &&
          foodComponentName.items.length > 0
        ? foodComponentName.items[0]
        : "Unknown item";

  return (
    <React.Fragment>
      {/* Main row (first occurrence) */}
      <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b dark:border-gray-700">
        <TableCell className="p-2">
          {/* Only show expand button if there are remaining offers */}
          {remainingOffers.length > 0 ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : (
            <span className="w-10 inline-block"></span>
          )}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          className="p-2 text-xs sm:text-sm"
        >
          <a
            className="font-medium text-blue-700 dark:text-blue-500 hover:underline"
            href={`https://etilbudsavis.dk/${firstOffer.store}/tilbudsaviser/${firstOffer.catelogid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {itemName}
          </a>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {foodComponentName.category}
          </div>
        </TableCell>
        <TableCell
          align="left"
          className="p-2 text-xs sm:text-sm text-gray-900 dark:text-gray-200"
        >
          {firstOffer.price} {firstOffer.priceCurrency}
        </TableCell>
        <TableCell
          align="left"
          className="p-2 text-xs sm:text-sm text-gray-900 dark:text-gray-200 hidden sm:table-cell"
        >
          {firstOffer.weight} {firstOffer.weightUnit}
        </TableCell>
        <TableCell
          align="left"
          className="p-2 text-xs sm:text-sm text-gray-900 dark:text-gray-200 hidden md:table-cell"
        >
          {DateTime.fromISO(firstOffer.offerStart).toFormat("yyyy-MM-dd")}
        </TableCell>
        <TableCell
          align="left"
          className="p-2 text-xs sm:text-sm text-gray-900 dark:text-gray-200 hidden md:table-cell"
        >
          {DateTime.fromISO(firstOffer.offerEnd).toFormat("yyyy-MM-dd")}
        </TableCell>
        <TableCell
          align="left"
          className="p-2 text-xs sm:text-sm text-gray-900 dark:text-gray-200"
        >
          {firstOffer.store}
        </TableCell>
      </TableRow>

      {/* Expandable row for remaining offers */}
      {remainingOffers.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  component="div"
                  className="text-gray-900 dark:text-gray-200 text-sm font-medium"
                >
                  More Offers for {itemName}
                </Typography>
                <div className="overflow-x-auto">
                  <Table size="small" aria-label="additional offers">
                    <TableHead>
                      <TableRow>
                        <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs">
                          Name
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs">
                          Price
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs hidden sm:table-cell">
                          Weight
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs hidden md:table-cell">
                          Offer Start
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs hidden md:table-cell">
                          Offer End
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs">
                          Store
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {remainingOffers.map((offer, index) => (
                        <TableRow key={index}>
                          <TableCell className="p-1 text-xs">
                            <a
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                              href={`https://etilbudsavis.dk/${offer.store}/tilbudsaviser/${offer.catelogid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {offer.name ?? itemName}
                            </a>
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs">
                            {offer.price} {offer.priceCurrency}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs hidden sm:table-cell">
                            {offer.weight} {offer.weightUnit}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs hidden md:table-cell">
                            {DateTime.fromISO(offer.offerStart).toFormat(
                              "dd-MM-yyyy"
                            )}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs hidden md:table-cell">
                            {DateTime.fromISO(offer.offerEnd).toFormat(
                              "dd-MM-yyyy"
                            )}
                          </TableCell>
                          <TableCell className="text-gray-900 dark:text-gray-200 p-1 text-xs">
                            {offer.store}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
