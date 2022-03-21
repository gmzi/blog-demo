import { parseISO, format } from "date-fns";
import { es } from 'date-fns/locale'
import { eng } from 'date-fns/locale'
import { text } from "../lib/data";

export default function Date({ dateString }) {

    const date = parseISO(dateString)

    if (text.date.locale === "es") {
        return (
            <time dateTime={dateString}>{format(date, `${text.date.date}`, { locale: es })}</time>
        )
    }
    return (
        <time dateTime={dateString}>{format(date, `${text.date.date}`, { locale: eng })}</time>
    )
}