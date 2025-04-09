import SVGCategoryOther from "@/blocks/dash_overview/svg_category_other"
import SVGCategoryHealth from "@/blocks/dash_overview/svg_category_health"
import SVGCategoryPersonal from "@/blocks/dash_overview/svg_category_personal"
import SVGCategoryRestaurant from "@/blocks/dash_overview/svg_category_restaurant"
import SVGCategoryRetail from "@/blocks/dash_overview/svg_category_retail"
import SVGCategorySalary from "@/blocks/dash_overview/svg_category_salary"
import SVGCategoryTransportation from "@/blocks/dash_overview/svg_category_transportation"

export const categories = [
    {
        value: "personal",
        label: "Personal",
        icon: SVGCategoryPersonal,
    },
    {
        value: "restaurant",
        label: "Restaurant",
        icon: SVGCategoryRestaurant,
    },
    {
        value: "retail",
        label: "Retail",
        icon: SVGCategoryRetail,
    },
    {
        value: "salary",
        label: "Salary",
        icon: SVGCategorySalary,
    },
    {
        value: "transportation",
        label: "Transportation",
        icon: SVGCategoryTransportation,
    },
    {
        value: "health",
        label: "Health",
        icon: SVGCategoryHealth,
    },
    {
        value: "other",
        label: "Other",
        icon: SVGCategoryOther,
    }
]