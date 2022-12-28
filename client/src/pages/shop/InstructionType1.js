import React from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import i1 from '../../static/img/in-1.jpg'
import i2 from '../../static/img/in-2.jpg'
import i3 from '../../static/img/in-3.jpeg'
import i4 from '../../static/img/i4.jpg'
import i5 from '../../static/img/i5.jpeg'
import i6 from '../../static/img/i6.jpg'
import i7 from '../../static/img/i7.JPG'
import i8 from '../../static/img/i8.JPG'
import i9 from '../../static/img/i9.jpeg'
import i10 from '../../static/img/i10.jpeg'
import i11 from '../../static/img/i11.jpg'
import i12 from '../../static/img/i12.jpg'
import i13 from '../../static/img/i13.JPG'
import i14 from '../../static/img/i14.JPG'
import i15 from '../../static/img/i15.jpeg'
import i16 from '../../static/img/i16.JPG'
import i17 from '../../static/img/i17.JPG'
import i18 from '../../static/img/i18.jpeg'
import i19 from '../../static/img/i19.JPG'
import i20 from '../../static/img/i20.JPG'
import i21 from '../../static/img/i21.jpeg'
import i22 from '../../static/img/i22.JPG'
import i23 from '../../static/img/i23.JPG'
import i24 from '../../static/img/i24.jpeg'
import i25 from '../../static/img/i25.jpg'
import i26 from '../../static/img/i26.jpg'
import i27 from '../../static/img/i27.JPG'
import i28 from '../../static/img/i28.jpeg'
import i29 from '../../static/img/i29.JPG'
import i30 from '../../static/img/i30.jpeg'

const InstructionType1 = () => {
    return <div className="container">
        <PageHeader />
        <main className="page w">
            <h1 className="pageHeading">
                Jak mierzyć stopę - czółenka
            </h1>

            <article className="page__content page__content--instruction">
                <p>
                    Poniższe zasady mierzenia stopy dotyczą obuwia typu czółenka (naszych aktualnych modeli Czółenka T-Bar I, Czółenka T-Bar II, Czółenka Glamour I oraz Czółenka Glamour II). Zasady mierzenia stopy dla modelu oficerek znajdują się w zakładce „<a className="notBold" href="/jak-mierzyc-stope-oficerki">Jak mierzyć stopę - oficerki</a>”.
                </p>
                <p>
                    W celu zmierzeniu stopy potrzebne będą:
                </p>
                <ul>
                    <li>Centymetr krawiecki,</li>
                    <li>2 kartki papieru o rozmiarze A4,</li>
                    <li>Długopis,</li>
                    <li>Przedmiot, który pozwoli wyznaczyć kąt prosty, np. ekierka, teczka tekturowa,</li>
                    <li>Telefon do wykonania zdjęć.</li>
                </ul>
                <p>
                    Wykonanie wszystkich czynności powinno zająć około 30 minut.
                </p>
                <p>
                    Poniżej znajduje się dokładna instrukcja wraz z ilustracjami i zdjęciami pokazującymi jak zmierzyć stopę i wykonać jej obrys oraz filmik instruktażowy.
                </p>
                <p>
                    Proszę postępować krok po kroku zgodnie z poniższymi punktami:
                </p>
                <p>
                    Poniższa instrukcja została przedstawiona dla stopy prawej. Dla lewej stopy prosimy postępować analogicznie.
                </p>
                <p>
                    1) Kładziemy kartkę papieru na podłodze i stawiamy na niej prawą stopę (stopa powinna być w cielistych skarpetkach/rajstopach/pończochach lub bez żadnych skarpetek).
                </p>
                <p>
                    2) Trzymając długopis pod kątem 70 stopni, obrysowujemy kształt stopy
                </p>
                <div className="page__images">
                    <img className="img--3" src={i1} alt="instrukcja" />
                    <img className="img--3" src={i2} alt="instrukcja" />
                    <img className="img--3" src={i3} alt="instrukcja" />
                </div>
                <p>
                    3) Zaznaczamy łuk podbicia podłużnego.
                </p>
                <div className="page__images">
                    <img className="img--2" src={i4} alt="instrukcja" />
                    <img className="img--2" src={i5} alt="instrukcja" />
                </div>
                <p>
                    4) Przystawiamy do pięty przedmiot, który pozwoli wyznaczyć kąt prosty, np. ekierkę, lub tekturową teczkę
                </p>
                <div className="page__images">
                    <img className="img--2" src={i6} alt="instrukcja" />
                    <img className="img--2" src={i7} alt="instrukcja" />
                </div>
                <p>
                    5) Zaznaczamy kropką miejsce styku wybranego przedmiotu i linii obrysu
                </p>
                <div className="page__images">
                    <img className="img--2" src={i8} alt="instrukcja" />
                    <img className="img--2" src={i9} alt="instrukcja" />
                </div>
                <p>
                    6) Zdejmujemy stopę z kartki, a następnie w prawym górnym rogu kartki wpisujemy literkę „P” („P” dla prawej stopy, „L” dla lewej stopy).
                </p>
                <div className="page__images">
                    <img className="img" src={i10} alt="instrukcja" />
                </div>
                <p>
                    Następnie podajemy wymiary stopy w centymetrach zgodnie z poniższym rysunkiem instruktażowym i opisanymi poniżej krokami.
                </p>
                <p className="bold">
                    Przy mierzeniu obwodów stopy prosimy unikać zarówno mocnego ściskania centymetrem oraz zbyt luźnego oplatania.
                </p>
                <p className="bold">
                    Przy mierzeniu obwodów prosimy o wykonanie zdjęć w taki sposób aby widoczny był wynik pomiaru na centymetrze.
                </p>
                <div className="page__images">
                    <img className="img--2" src={i11} alt="instrukcja" />
                    <img className="img--2" src={i12} alt="instrukcja" />
                </div>
                <p>
                    7) Wymiar A - obwód przy kościach śródstopia
                </p>
                <p className="m1">
                    a) Znajdujemy kości śródstopia
                </p>
                <div className="page__images m1">
                    <img className="img" src={i13} alt="instrukcja" />
                </div>
                <p className="m1">
                    b) Centymetrem krawieckim mierzymy obwód stopy w miejscu wyznaczonym w  poprzednim punkcie (7a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i14} alt="instrukcja" />
                </div>
                <p className="m1">
                    c) Wykonujemy zdjęcie telefonem (analogicznie do powyższego zdjęcia z punktu 7b)
                </p>
                <p className="m1">
                    d) Wpisujemy wymiar na kartkę z obrysem z zaznaczeniem poziomymi kreskami miejsca mierzenia (wyznaczonego w punkcie 7a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i15} alt="instrukcja" />
                </div>
                <p>
                    8) Wymiar B - obwód pod kośćmi śródstopia
                </p>
                <p className="m1">
                    a) Znajdujemy miejsce tuż pod kośćmi śródstopia
                </p>
                <div className="page__images m1">
                    <img className="img" src={i16} alt="instrukcja" />
                </div>
                <p className="m1">
                    b) Centymetrem krawieckim mierzymy obwód stopy w miejscu wyznaczonym w poprzednim punkcie (8a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i17} alt="instrukcja" />
                </div>
                <p className="m1">
                    c) Wykonujemy zdjęcie telefonem (analogicznie do powyższego zdjęcia z punktu 8b)
                </p>
                <p className="m1">
                    d) Wpisujemy wymiar na kartkę z obrysem z zaznaczeniem poziomymi kreskami miejsca mierzenia (wyznaczonego w punkcie 8a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i18} alt="instrukcja" />
                </div>

                <p>
                    9) Wymiar C - obwód w podbiciu
                </p>
                <p className="m1">
                    a) Znajdujemy najwyższy punkt na łuku podbicia
                </p>
                <div className="page__images m1">
                    <img className="img" src={i19} alt="instrukcja" />
                </div>
                <p className="m1">
                    b) Centymetrem krawieckim mierzymy obwód stopy w miejscu wyznaczonym w  poprzednim punkcie (9a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i20} alt="instrukcja" />
                </div>
                <p className="m1">
                    c) Wykonujemy zdjęcie telefonem (analogicznie do powyższego zdjęcia z punktu 9b). Tak jak na przykładzie, zdjęcie powinno pokazywać wewnętrzny bok stopy wraz z podbiciem i oczywiście miarką krawiecką.
                </p>
                <p className="m1">
                    d) Wpisujemy wymiar na kartkę z obrysem z zaznaczeniem poziomymi kreskami miejsca mierzenia (wyznaczonego w punkcie 9a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i21} alt="instrukcja" />
                </div>

                <p>
                    10) Wymiar D – obwód „przez piętę”
                </p>
                <p className="m1">
                    a) Znajdujemy odcinek od pięty do „przodu stopy”
                </p>
                <div className="page__images m1">
                    <img className="img" src={i22} alt="instrukcja" />
                </div>
                <p className="m1">
                    b) Centymetrem krawieckim mierzymy obwód na bazie odcinka wyznaczonego w poprzednim punkcie (10a)
                </p>
                <div className="page__images m1">
                    <img className="img" src={i23} alt="instrukcja" />
                </div>
                <p className="m1">
                    c) Wykonujemy zdjęcie telefonem (analogicznie do powyższego zdjęcia z punktu 10b). Tak jak na przykładzie, zdjęcie powinno pokazywać wewnętrzny bok stopy wraz z piętą i oczywiście miarką krawiecką.
                </p>
                <p className="m1">
                    d) Wpisujemy wymiar na kartkę
                </p>
                <div className="page__images m1">
                    <img className="img" src={i24} alt="instrukcja" />
                </div>

                <p>
                    Następnie podajemy długość i szerokość stopy zgodnie z poniższym rysunkiem instruktażowym i opisanymi poniżej krokami:
                </p>
                <div className="page__images">
                    <img className="img--2" src={i25} alt="instrukcja" />
                    <img className="img--2" src={i26} alt="instrukcja" />
                </div>

                <p>
                    11) Wymiar E – szerokość stopy
                </p>
                <p className="m1">
                    a) Na obrysie stopy znajdujemy miejsce w którym mierzyliśmy obwód kości śródstopia (obwód A)
                </p>
                <p className="m1">
                    b) Wyznaczamy długość tego odcinka
                </p>
                <div className="page__images m1">
                    <img className="img" src={i27} alt="instrukcja" />
                </div>
                <p className="m1">
                    c) Wpisujemy wymiar na kartkę
                </p>
                <div className="page__images m1">
                    <img className="img" src={i28} alt="instrukcja" />
                </div>

                <p>
                    12) Wymiar F – długość stopy
                </p>
                <p className="m1">
                    a) Na obrysie stopy znajdujemy kropkę wyznaczoną w punkcie 4 i 5 niniejszej instrukcji
                </p>
                <p className="m1">
                    b) Mierzymy długość od zaznaczonej kropki do najdłuższego palca (nie zawsze najdłuższym palcem jest duży palec).
                </p>
                <div className="page__images m1">
                    <img className="img" src={i29} alt="instrukcja" />
                </div>
                <p className="m1">
                    c) Wpisujemy wymiar na kartkę
                </p>
                <div className="page__images m1">
                    <img className="img" src={i30} alt="instrukcja" />
                </div>
                <p>
                    13) Wszystkie powyższe punkty powtarzamy dla stopy lewej
                </p>

                <p>
                    W celu upewnienia się, że wszystkie wymiary zostały podane poprawnie, rekomendujemy ich weryfikacje poprzez ponowne wykonanie obrysu i wyznaczenie wszystkich wymiarów.
                </p>

                <iframe width="860" height={window.innerWidth < 768 ? "325" : "465"} src="https://www.youtube.com/embed/krzKh9sREkE"
                        title="YouTube video player" frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen></iframe>

                <p>
                    Po złożeniu rezerwacji na parę obuwia w naszym sklepie internetowym, czekamy 7 dni roboczych na wypełnienie Formularza Mierzenia Stopy znajdującego się w panelu klienta (w którym podajemy wymiary wraz ze zdjęciami stopy) oraz na przesłanie kartki z obrysem stopy lewej oraz prawej na nasz adres korespondencyjny
                </p>
                <p className="text-center">
                    Sklep Anna Vinbotti<br/>
                    Ul. Tomasza Zana 43 / lok. 2.1<br/>
                    20 – 601 Lublin
                </p>
                <p>
                    wraz z dołączona informacją o numerze rezerwacji. W przypadku jakichkolwiek wątpliwości dotyczących instrukcji, prosimy o kontakt z nami poprzez formularz kontaktowy, telefonicznie, lub bezpośrednio na adres mailowy office@anna-vinbotti.com.
                </p>
            </article>
        </main>
        <Footer />
    </div>
};

export default InstructionType1;
