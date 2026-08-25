import React from "react";
import Link from "next/link";
import { Category } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

interface CategoryBadgeProps {
  category: Category;
  clickable?: boolean;
}

export function CategoryBadge({ category, clickable = true }: CategoryBadgeProps) {
  const content = (
    <Badge variant="cyan" size="sm" className="font-semibold tracking-wide">
      {category.name}
    </Badge>
  );

  if (clickable) {
    return <Link href={`/${category.slug}`}>{content}</Link>;
  }

  return content;
}
