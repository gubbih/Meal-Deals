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
                            "yyyy-MM-dd",
                          )}
                        </TableCell>
                        <TableCell>
                          {DateTime.fromISO(offer.offerEnd).toFormat(
                            "yyyy-MM-dd",
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
