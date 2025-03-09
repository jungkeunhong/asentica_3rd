import { PriceData } from '@/types/medspa';

interface PriceDisplayProps {
  priceData: PriceData | string;
}

export function PriceDisplay({ priceData }: PriceDisplayProps) {
  if (typeof priceData === 'string') {
    return <div>{priceData}</div>;
  }

  const formattedPrice = new Intl.NumberFormat('en-US').format(Number(priceData.standard_price || 0));
  const standardUnit = priceData.standard_unit ? priceData.standard_unit.toLowerCase() : 'unit';
  const standardPrice = `$${formattedPrice} per ${standardUnit}`;

  if (priceData.member_price) {
    const formattedMemberPrice = new Intl.NumberFormat('en-US').format(Number(priceData.member_price));
    const memberUnit = priceData.member_unit ? priceData.member_unit.toLowerCase() : 'unit';
    const memberPrice = `$${formattedMemberPrice} per ${memberUnit}`;
    
    return (
      <div>
        <div>{standardPrice}</div>
        <div className="text-sm text-green-600">Member: {memberPrice}</div>
      </div>
    );
  }
  
  return <div>{standardPrice}</div>;
} 