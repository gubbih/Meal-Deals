import React, { useState } from "react";
import { DateTime } from "luxon";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
  const remainingOffers = offers.slice(0); // Get all offers

  // Get the item name to display
  const itemName =
    typeof foodComponentName.items === "string"
      ? foodComponentName.items
      : Array.isArray(foodComponentName.items) &&
          foodComponentName.items.length > 0
        ? foodComponentName.items[0]
        : "Unknown item";

  // Calculate price per unit (if possible)
  const pricePerUnit =
    firstOffer.weight > 0
      ? (firstOffer.price / firstOffer.weight).toFixed(2)
      : null;

  return (
    <React.Fragment>
      {/* Main row - Two column layout from Design 8 */}
      <TableRow className="border-x dark:border-gray-700">
        <TableCell
          colSpan={7}
          className="p-0 border border-gray-200 dark:border-gray-700"
        >
          <div className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 p-3 min-h-[4.5rem]">
              {/* Left side (ingredient info) - Takes more space */}
              <div className="sm:col-span-4 flex">
                {/* Expand button */}
                <div className="pr-3 pt-1">
                  {remainingOffers.length > 0 ? (
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  ) : (
                    <div className="w-8"></div>
                  )}
                </div>

                {/* Name and category */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-start mb-1">
                    <div className="flex-1">
                      <a
                        href={`https://etilbudsavis.dk/${firstOffer.store}/tilbudsaviser/${firstOffer.catelogid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 break-words line-clamp-2"
                        title={itemName}
                      >
                        {itemName}
                      </a>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {foodComponentName.category}
                  </div>

                  {/* Dates - Only visible on mobile */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:hidden flex items-center">
                    <svg
                      className="w-3.5 h-3.5 mr-1.5 text-gray-500 dark:text-gray-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {DateTime.fromISO(firstOffer.offerStart).toFormat("dd/MM")}{" "}
                    - {DateTime.fromISO(firstOffer.offerEnd).toFormat("dd/MM")}
                  </div>
                </div>
              </div>

              {/* Right side (offer info) */}
              <div className="sm:col-span-2 flex justify-between items-center">
                {/* Price and weight */}
                <div className="flex flex-col justify-center">
                  <div className="font-bold text-lg text-gray-900 dark:text-white">
                    {firstOffer.price} {firstOffer.priceCurrency}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {firstOffer.weight} {firstOffer.weightUnit}
                  </div>
                </div>

                {/* Store and dates */}
                <div className="ml-3 flex flex-col items-end justify-center h-full">
                  <div
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-300 text-sm font-medium truncate max-w-[140px] mb-1"
                    title={firstOffer.store}
                  >
                    {firstOffer.store}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:flex items-center">
                    <svg
                      className="w-3 h-3 mr-1 text-gray-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {DateTime.fromISO(firstOffer.offerStart).toFormat("dd/MM")}{" "}
                    - {DateTime.fromISO(firstOffer.offerEnd).toFormat("dd/MM")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Expandable content - Premium cards from Design 10 */}
      {remainingOffers.length > 0 && (
        <TableRow>
          <TableCell
            colSpan={7}
            className="p-0 border border-gray-200 dark:border-gray-700"
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <div className="py-4 px-6 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {remainingOffers.map((offer, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
                    >
                      {/* Header with store */}
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-x border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span
                          className="font-medium text-gray-700 dark:text-gray-200 truncate max-w-[200px]"
                          title={offer.store}
                        >
                          {offer.store}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <svg
                            className="w-3 h-3 mr-1 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>
                            {DateTime.fromISO(offer.offerStart).toFormat(
                              "d MMM"
                            )}{" "}
                            til{" "}
                            {DateTime.fromISO(offer.offerEnd).toFormat("d MMM")}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 flex-1 flex flex-col">
                        <a
                          href={`https://etilbudsavis.dk/${offer.store}/tilbudsaviser/${offer.catelogid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium mb-3 line-clamp-2 flex-1"
                          title={offer.name || itemName}
                        >
                          {offer.name || itemName}
                        </a>

                        <div className="flex justify-between items-end pt-2 border-t border-gray-100 dark:border-gray-700 mt-auto">
                          <div className="flex items-baseline">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {offer.price}
                            </span>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                              {offer.priceCurrency}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {offer.weight} {offer.weightUnit}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
