import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {ContentContext} from "../../App";
import {getField} from "../../helpers/content";
import {convertFromRaw} from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import LoadingPage from "../../components/shop/LoadingPage";
import OrderInstruction from "../../components/shop/OrderInstruction";

const Warranty = () => {
    return <div className="container">
        <PageHeader />
        <main className="page w">
            <h1 className="pageHeading">
                 Gwarancja
            </h1>

            <article className="page__content page__content--warranty">
                <p>
                    1. Niniejszy dokument (dalej: „Oświadczenie gwarancyjne”) określa zasady i warunki gwarancji (dalej: „Gwarancja”) obejmującej obuwie (dalej: „Produkt”) sprzedane przez Annę Kot, prowadzącą działalność gospodarczą pod firmą „Anna Kot” (adres stałego miejsca wykonywania działalności gospodarczej: ul. Stawki 21/18, 01-040 Warszawa), wpisaną do Centralnej Ewidencji i Informacji o Działalności Gospodarczej, posiadającą numer NIP: 7132964715, numer REGON: 388283299 (dalej: „Gwarant”).<br/>
                    2. Podmiotem odpowiedzialnym z tytułu udzielonej Gwarancji jest Gwarant.<br/>
                    3. Czas trwania ochrony gwarancyjnej wynosi 2 (dwa) lata od dnia wydania Produktu kupującemu (dalej: „Kupujący”).<br/>
                    4. Terytorialny zasięg ochrony gwarancyjnej obejmuje wyłącznie terytorium Rzeczypospolitej Polskiej. Gwarant nie jest zobowiązany do wykonywania świadczeń wynikających z Gwarancji poza terytorium Rzeczypospolitej Polskiej.<br/>
                    5. Gwarant oświadcza, że Produkt powinien zostać wydany Kupującemu w stanie wolnym od wad fizycznych. W przypadku stwierdzenia, że Produkt posiada wadę fizyczną, Gwarant zobowiązany jest do:<br/>
                </p>
                <p className="m1">
                    1) usunięcia wady Produktu albo<br/>
                    2) wymiany wadliwego Produktu na Produkt wolny od wad albo<br/>
                    3) zwrotu ceny zapłaconej za Produkt.
                </p>
                <p>
                    6. Ochrona gwarancyjna nie obejmuje:
                </p>
                <p className="m1">
                    1) prawideł dostarczonych Kupującemu wraz z Produktem;<br/>
                    2) zmian wynikających ze zwykłego używania Produktu, w szczególności:
                </p>
                <p className="m2">
                    a) startych fleków, podeszw i zelówek,<br/>
                    b) śladów potu lub brudu na wkładce i podszewce,<br/>
                    c) uszkodzeń skóry oblekającej obcasy;
                </p>
                <p className="m1">
                    3) uszkodzeń wynikających z nieprawidłowego używania (w tym z używania w sposób prowadzących do powstania uszkodzeń mechanicznych) lub konserwowania i pielęgnacji Produktu, w szczególności:
                </p>
                <p className="m2">
                    a) rozcięć,<br/>
                    b) przebarwień,<br/>
                    c) uszkodzeń wynikających z nieprawidłowego użycia prawideł,<br/>
                    d) odkształceń cholewki wynikających z użycia akcesoriów obuwniczych (wkładek, zapiętek itp.),<br/>
                    e) uszkodzeń wynikających z nieprawidłowych napraw lub ulepszeń dokonywanych lub zlecanych przez Kupującego.
                </p>
                <p>
                    7. Wyboru konkretnego świadczenia spośród świadczeń wskazanych w ust. 5 powyżej dokonuje Gwarant.<br/>
                    8. Koszt wykonania świadczeń wskazanych w ust.  5 powyżej ponosi Gwarant.<br/>
                    9. Kupujący zobowiązany jest zawiadomić Gwaranta o stwierdzonej wadzie Produktu w terminie 14 (czternastu) dni od dnia jej stwierdzenia. Do zachowania terminu wskazanemu w zdaniu poprzedzającym, wystarczy wysłanie zawiadomienia przed jego upływem.<br/>
                    10. W przypadku uchybienia przez Kupującego terminowi wskazanemu w ust. 9 powyżej, traci on uprawnienia wynikające z Gwarancji.<br/>
                    11. Zawiadomienie, o którym mowa w ust. 9 powyżej (dalej: „Zawiadomienie”), dokonywane jest za pomocą poczty elektronicznej, pod adresem: office@anna-vinbotti.com.<br/>
                    12. Zawiadomienie powinno zawierać:
                </p>
                <p className="m1">
                    1) imię i nazwisko Kupującego;<br/>
                    2) adres do korespondencji lub adres poczty elektronicznej;<br/>
                    3) numer telefonu;<br/>
                    4) datę dostarczenia Produktu;<br/>
                    5) datę stwierdzenia wady Produktu;<br/>
                    6) opis stwierdzonej wady Produktu;<br/>
                    7) propozycję Kupującego w zakresie wyboru konkretnego świadczenia Gwaranta (Gwarant nie jest jednak związany propozycją Kupującego).
                </p>
                <p>
                    13. Do Zawiadomienia należy dołączyć:
                </p>
                <p className="m1">
                    1) dowód zakupu Produktu (np. wiadomość mailową potwierdzającą zakup);<br/>
                    2) fotografie ukazujące wady Produktu (jeżeli ich wykonanie jest możliwe).
                </p>
                <p>
                    14. Gwarant zobowiązany jest rozpatrzyć Zawiadomienie w terminie 14 (czternastu) dni od dnia jego otrzymania. W przypadku, gdy Zawiadomienie nie zawiera któregokolwiek z elementów wskazanych w ust. 12-13 powyżej, termin wskazany w zdaniu poprzedzającym biegnie do dnia uzupełnienia braku.<br/>
                    15. Po rozpatrzeniu Zawiadomienia, Gwarant podejmuje decyzję o:
                </p>
                <p className="m1">
                    1) przyjęciu Zawiadomienia albo<br/>
                    2) odrzuceniu Zawiadomienia jako niezasadnego.
                </p>
                <p>
                    16. Decyzja wskazana w ust. 15 powyżej jest ostateczna i nie przysługuje od niej odwołanie.<br/>
                    17. O podjętej decyzji, Gwarant zawiadamia Kupującego za pomocą poczty elektronicznej. W przypadku przyjęcia Zawiadomienia, Gwarant jednocześnie zawiadamia Kupującego o świadczeniu, które zostanie zrealizowane w ramach Gwarancji.<br/>
                    18. Po otrzymaniu decyzji o przyjęciu Zawiadomienia, Kupujący powinien odesłać wadliwy Produkt pocztą tradycyjną albo przesyłką kurierską pod adres wskazany przez Gwaranta w wiadomości, o której mowa w ust. 17 powyżej.<br/>
                    19. Kupujący korzystający z uprawnień wynikających z Gwarancji powinien na swój koszt odesłać wadliwy Produkt pod adres wskazany przez Gwaranta, a następnie zwrócić się do Gwaranta o zwrot tych kosztów. Koszty, o których mowa w zdaniu poprzedzającym, Gwarant zwraca Kupującemu równocześnie z ukończeniem realizacji świadczenia w ramach Gwarancji.<br/>
                    20. Po otrzymaniu wadliwego Produktu, Gwarant przystępuje do realizacji świadczenia w ramach Gwarancji. Termin realizacji świadczenia biegnie od dnia otrzymania wadliwego Produktu i wynosi:
                </p>
                <p className="m1">
                    1) w przypadku usunięcia wady Produktu – 30 (trzydzieści) dni;<br/>
                    2) w przypadku wymiany Produktu na wolny od wad – 30 (trzydzieści dni);<br/>
                    3) w przypadku zwrotu zapłaconej ceny – 14 (czternaście) dni.
                </p>
                <p>
                    21. Gwarant odsyła naprawiony Produkt albo Produkt wolny od wad niezwłocznie po zakończeniu realizacji świadczenia, nie później jednak niż w terminie 7 (siedmiu) dni. Odesłanie Produktu następuje na koszt Gwaranta, za pomocą poczty tradycyjnej albo przesyłki kurierskiej.<br/>
                    22. Odesłany Produkt jest objęty Gwarancją w takim samym zakresie, jak Produkt pierwotnie nabyty przez Kupującego. Czas trwania ochrony gwarancyjnej odesłanego Produktu rozpoczyna się od dnia jego otrzymania przez Kupującego.<br/>
                    23. Gwarancja nie wyłącza, nie ogranicza ani nie zawiesza uprawnień Kupującego wynikających z przepisów o rękojmi za wady Produktu.
                </p>
            </article>
        </main>
        <Footer />
    </div>
};

export default Warranty;
