import { redirect } from "next/navigation";

export default function Daily() {
    const TODAY = new Date().toLocaleDateString('en-CA') // Get today's date in YYYY-MM-DD format
    redirect(`/daily/${TODAY}`);
}