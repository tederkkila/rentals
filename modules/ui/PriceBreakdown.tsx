import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import React, {useEffect} from "react";

interface PriceBreakdownProps {
    dateMatrix: Record<string, any>;
    tax: number;
    setQuote: (quote: number) => void;
}

export default function PriceBreakdown({ dateMatrix, tax, setQuote }: PriceBreakdownProps) {

    //console.log(dateMatrix);
    //console.log(tax);

    const priceCounts: Record<number, number> = {};
    for (const date in dateMatrix) {
        const price = dateMatrix[date].price;
        priceCounts[price] = (priceCounts[price] || 0) + 1;
    }

    let totalPrice = 0;
    let totalNights = 0;


    const priceComponents: React.ReactNode[] = Object.entries(priceCounts).map(([ key, count ]) => {
        let price: number = parseInt(key);
        totalPrice += price * count;
        totalNights += count;
        return (
            <PriceLine
                key={key}
                title={`$${key} x ${count} night(s)`}
                amount={price * count}
            />

        );
    });

    const totalTaxes = Math.round(totalPrice * tax);
    totalPrice += totalTaxes;

    useEffect(() => {
        // console.log("totalPrice: " + totalPrice);
        setQuote(totalPrice);
    }, [dateMatrix]);


    return (
        <Collapsible className="text-sm text-gray-600 mb-2 mt-0 bg-gray-100 p-2">
            {/* Added 'group' to the trigger to share its open state with the chevron */}
            <CollapsibleTrigger className="font-bold flex justify-between items-center w-full text-left group">
                <span>Price Details (USD)</span>

                {/* Chevron Arrow Icon */}
                <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
                {priceComponents}
                <PriceLine title="Taxes" amount={totalTaxes} />

            </CollapsibleContent>

            <div className="flex nowrap justify-between font-bold mt-1">
                <span>{totalNights} night Total</span>
                <span>${totalPrice}</span>
            </div>
        </Collapsible>
    );
}

interface PriceLineProps {
    title: string;
    amount: number;
}

const PriceLine = ({title, amount}: PriceLineProps) => {
    return (
        <div className="flex nowrap justify-between">
            <span>{title}</span>
            <span>${amount}</span>
        </div>
    )
}