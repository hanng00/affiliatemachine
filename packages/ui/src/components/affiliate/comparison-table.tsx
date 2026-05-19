import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Rating } from "./rating";
import { PriceTag } from "./price-tag";
import { CTAButton } from "./cta-button";
import { type AffiliateProduct } from "./affiliate-card";
import { cn } from "../../lib/utils";

interface ComparisonTableProps {
  products: AffiliateProduct[];
  columns?: ("rating" | "price" | "features")[];
  className?: string;
}

export function ComparisonTable({
  products,
  columns = ["rating", "price", "features"],
  className,
}: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Produkt</TableHead>
            {columns.includes("rating") && <TableHead>Betyg</TableHead>}
            {columns.includes("price") && <TableHead>Pris</TableHead>}
            {columns.includes("features") && <TableHead className="hidden md:table-cell">Funktioner</TableHead>}
            <TableHead className="text-right">Länk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="font-bold">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {product.logo && (
                    <img
                      src={product.logo}
                      alt={`${product.name} logo`}
                      className="h-10 w-10 rounded object-contain"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.name}</span>
                      {product.badge && (
                        <Badge variant="success" className="text-xs">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              {columns.includes("rating") && (
                <TableCell>{product.rating ? <Rating value={product.rating} size="sm" /> : "-"}</TableCell>
              )}
              {columns.includes("price") && (
                <TableCell>
                  <PriceTag
                    amount={product.price.amount}
                    currency={product.price.currency}
                    period={product.price.period}
                    size="sm"
                  />
                </TableCell>
              )}
              {columns.includes("features") && (
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {product.features?.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              )}
              <TableCell className="text-right">
                <CTAButton href={product.trackingUrl} trackingId={product.id} size="sm" showIcon={false}>
                  Till butik
                </CTAButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
