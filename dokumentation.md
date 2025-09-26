

# Heva SwapHub dokumentation 
**Hold nr**: WU12

**Valgfri opgave:**

 jeg har valgt (C) og lidt (A)
- **C** – Opret bruger / Login / Profil: **implementeret fuldt ud**.  
- **A** – Filtrering: **inkluderet i enkel form** (søgefelt + pagination).  



## 1) Opsætning 

cd api
npm install
npm start      NEXT_PUBLIC_API_BASE_URL=http://localhost:4000


cd projekt
npm install
npm run dev    kører på http://localhost:3000



## 2) Min indsats (hvad jeg har lavet)
- Jeg har opsat **Next.js App Router** og har struktureret siderne.  
- Jeg har bygget **Forside** med søgning og **pagination** (6 kort pr. side).  
- Jeg har bygget **Detaljeside** med billede, titel og beskrivelse.  
- Jeg har lavet **Login / Register / Profile** på frontend (jeg har gemt `token`/`userId` lokalt og har styret UI-tilstanden).  
- Jeg har lavet **Contact / Newsletter** (frontend-validering + kald).  
- Jeg har skrevet og stylet UI med **Tailwind** efter kravdokumenterne.  
- Jeg har lavet generel fejlhåndtering i `apiClient.js` (klare fejlbeskeder til brugeren).

## 3) Tech-stack (Frontend)

- **Next.js (App Router)**  
  React-framework med mappebaseret routing og serverkomponenter; bruges til siderne (`/`, `/listing/[id]`, `/login`, `/register`, `/profile`, `/contact`) med hurtig SPA-navigation via `next/link` og bedre billedydelse via `next/image`, så ruterne er lette at styre og siden føles hurtig uden fuldt reload.

- **React**  
  Komponentbaseret UI med enkel client-state (login-form, beskeder, betinget visning); genbrug af `ItemCard`, `SearchBar`, `Pagination`, `ProposeButton` gør koden overskuelig og nem at vedligeholde.

- **Tailwind CSS**  
  Utility-first styling direkte i JSX for layout, afstande, typografi og responsivitet, hvilket gør det hurtigt at bygge et ensartet design uden store CSS-filer.

- **Fetch API (client-wrapper)**  
  Fælles kald i `src/lib/apiClient.js` med automatisk `Authorization: Bearer <token>` og simpel fejlhåndtering, så login, listevisning og detaljer hentes på samme måde uden gentaget kode.

- **Web Storage (localStorage)**  
  Gemmer `token` og `userId` efter login og styrer UI’et (f.eks. vis **Propose** kun ved login), så brugerens tilstand bliver husket mellem sider og sessioner.

- **Next/Image & Next/Link**  
  `next/image` giver optimerede, responsive billeder med lazy/eager indlæsning, og `next/link` giver hurtig klientnavigation, så både forside og detaljeside loader smidigt.

- **Git & GitHub**  
  Versionsstyring med branches og klare commits til frontend-ændringer, så arbejde kan rulles tilbage, gennemgås og deles nemt.




**4)Kode-eksempel**

## ItemCard.jsx 
### .1 (A – enkelt komponent-kode)
 
```jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/media";

export default function ItemCard({ item, priority = false }) {
  const img = getImageUrl(item);

  return (
    <Link href={`/listing/${item.id}`} className="block rounded-xl border bg-white hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-100 relative">
        <Image
          src={img}
          alt={item?.title || "Listing"}
          fill
          className="object-cover"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={priority}
          loading={priority ? "eager" : undefined}
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
          {item?.title || "Untitled"}
        </h3>
      </div>
    </Link>
  );
}
```
**forklaring:** Jeg viser et klikbart kort for ét listing.
 Jeg finder billedkilden robust via `getImageUrl`. `next/image` giver bedre performance (optimering og responsive størrelser),
  og `next/link` giver hurtig navigation uden fuld side-reload.

### .2 `getImageUrl(item)`
```js
export function getImageUrl(item) {
  const url =
    item?.asset?.url ||
    item?.asset?.href ||
    item?.assets?.[0]?.url ||
    item?.assets?.[0]?.href ||
    item?.imageUrl || null;

  return url && typeof url === "string" ? url : null;
}

```
**Ide**  Returnerer første gyldige billed-URL på tværs af forskellige feltnavne/strukturer.



