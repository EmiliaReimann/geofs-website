import styles from "@/app/page.module.css"
import localStyle from "./page.module.css"

import { BACKEND_BASE } from "@/app/BACKEND_URL"

import DOMPurify from "isomorphic-dompurify"

export default async function Site() {

    const job_entries = []

    // call API to fetch news articles
    const resp = await fetch(
        `${BACKEND_BASE}/joblistings`,
        { method: "GET", cache: "no-store" }
    )

    if (resp.status !== 200) {
        job_entries.push("Error fetching Job listings!")
    } else {
        const entries = await resp.json()
        entries.map(entry => {
            const html_to_insert = DOMPurify.sanitize(
                entry.content
                    .replaceAll("<h1>", `<h1 class=${styles.BigHeading}>`)  // apply h1 formatting
                    .replaceAll("<h2>", `<h1 class=${styles.SmallHeading}>`) // apply h2 formatting
                    .replaceAll("<h3>", `<h1 class=${styles.VerySmallHeading}>`) //apply h3 formatting
                    .replaceAll("<div>", `<div class=${styles.Textblock}>`) // apply Textbox formatting to divs
            )
            job_entries.push(
                <div className={localStyle.Blogpost} key={entry.id}>
                    <div dangerouslySetInnerHTML={{ __html: html_to_insert }} />
                </div>
            )
        })
    }


    return (
        <>
            <h1 className={styles.BigHeading}>Jobs und Co</h1>
            {job_entries.map(entry => entry)}
        </>
    )
}