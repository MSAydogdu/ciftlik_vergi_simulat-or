// React is loaded globally via CDN
const { useState } = React;

const aciklamalar = {
  girisBedeli: "Yatırımcıdan alınan hayvan başı giriş bedeli (KDV hariç)",
  girisKDV: "Yatırımcıdan alınan giriş bedeli üzerinden uygulanacak KDV oranı (%)",
  sutFiyati: "1 litre süt satış fiyatı (TL)",
  sutKDV: "Süt satışında uygulanan KDV oranı (%)",
  aylikSutMiktari: "Bir ineğin aylık verdiği ortalama süt miktarı (litre)",
  yillikBuzagiGeliri: "Bir ineğin yıllık doğurduğu buzağıdan elde edilen gelir (TL)",
  buzagiKDV: "Buzağı satışında uygulanan KDV oranı (%)",
  yemGideri: "Aylık hayvan başı yem maliyeti (TL)",
  veterinerGideriSirket: "Şirketin toplam veteriner gideri (aylık, TL)",
  kiraGideriSirket: "Şirketin aylık çiftlik kira gideri (TL)",
  cobanGideriYatirimci: "Yatırımcıya ait hayvan için aylık çoban gideri (TL)",
  cobanGideriSirket: "Şirketin toplam çoban gideri (aylık, TL)",
  yatirimciOdemeStopaj: "Yatırımcıya yapılan ödeme için uygulanacak stopaj oranı (%)",
  gelirVergisi: "Net kâr üzerinden alınan gelir vergisi oranı (%)",
  inekSayisiSirket: "Şirketin sahip olduğu toplam inek sayısı",
  inekSayisiYatirimci: "Yatırımcının sahip olduğu inek sayısı",
  amortismanGideriSirket: "Şirketin yıllık amortisman gideri (TL)",
  amortismanGideriYatirimci: "Yatırımcının yıllık amortisman gideri (hayvan başı, TL)"
};

const varsayilanVeri = {
  girisBedeli: 150000,
  girisKDV: 20,
  sutFiyati: 18,
  sutKDV: 1,
  aylikSutMiktari: 300,
  yillikBuzagiGeliri: 12000,
  buzagiKDV: 1,
  yemGideri: 2000,
  veterinerGideriSirket: 15000,
  kiraGideriSirket: 20000,
  cobanGideriYatirimci: 500,
  cobanGideriSirket: 15000,
  yatirimciOdemeStopaj: 20,
  gelirVergisi: 23,
  inekSayisiSirket: 300,
  inekSayisiYatirimci: 1,
  amortismanGideriSirket: 60000,
  amortismanGideriYatirimci: 2000
};

function hesaplaYillikVeri(veri, hayvanSayisi, tip) {
  const aylikSutGeliri = veri.sutFiyati * veri.aylikSutMiktari * hayvanSayisi;
  const yillikSutGeliri = aylikSutGeliri * 12;
  const yillikSutKDV = yillikSutGeliri * (veri.sutKDV / 100);

  const yillikBuzagiGeliri = veri.yillikBuzagiGeliri * hayvanSayisi;
  const yillikBuzagiKDV = yillikBuzagiGeliri * (veri.buzagiKDV / 100);

  const yemGideri = veri.yemGideri * hayvanSayisi * 12;
  const cobanGideri =
    tip === "yatirimci"
      ? veri.cobanGideriYatirimci * hayvanSayisi * 12
      : veri.cobanGideriSirket;
  const veterinerGideri = tip === "sirket" ? veri.veterinerGideriSirket : 0;
  const kiraGideri = tip === "sirket" ? veri.kiraGideriSirket : 0;
  const amortismanGideri =
    tip === "sirket"
      ? veri.amortismanGideriSirket
      : veri.amortismanGideriYatirimci * hayvanSayisi;

  const toplamGelir = yillikSutGeliri + yillikBuzagiGeliri;
  const toplamKDV = yillikSutKDV + yillikBuzagiKDV;
  const toplamGider = yemGideri + cobanGideri + veterinerGideri + kiraGideri + amortismanGideri;

  const ebitda = toplamGelir - (toplamGider - amortismanGideri);
  const gelirVergisi = ebitda * (veri.gelirVergisi / 100);
  const netKar = ebitda - gelirVergisi;

  const gelenKDV = yillikSutKDV + yillikBuzagiKDV;
  const gidenKDV = 0;
  const odenecekKDV = gelenKDV - gidenKDV;

  return {
    Gelirler: {
      "Süt Geliri": yillikSutGeliri,
      "Süt KDV": yillikSutKDV,
      "Buzağı Geliri": yillikBuzagiGeliri,
      "Buzağı KDV": yillikBuzagiKDV
    },
    Giderler: {
      "Yem Gideri": yemGideri,
      "Çoban Gideri": cobanGideri,
      "Veteriner Gideri": veterinerGideri,
      "Kira Gideri": kiraGideri,
      "Amortisman Gideri": amortismanGideri
    },
    KarZarar: {
      EBITDA: ebitda,
      "Gelir Vergisi": gelirVergisi,
      "Net Kâr": netKar
    },
    KDVTablosu: {
      "Gelen KDV": gelenKDV,
      "Giden KDV": gidenKDV,
      "Ödenecek KDV": odenecekKDV
    }
  };
}

function VergiSimulasyonuTablosu() {
  const [veri, setVeri] = useState(varsayilanVeri);
  const yatirimci = hesaplaYillikVeri(veri, veri.inekSayisiYatirimci, "yatirimci");
  const sirket = hesaplaYillikVeri(veri, veri.inekSayisiSirket, "sirket");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVeri({ ...veri, [name]: parseFloat(value) || 0 });
  };

  const renderGroupedInputs = () => {
    const gruplar = {
      "Yatırımcı Parametreleri": [
        "inekSayisiYatirimci", "cobanGideriYatirimci", "amortismanGideriYatirimci"
      ],
      "Şirket Parametreleri": [
        "inekSayisiSirket", "veterinerGideriSirket", "kiraGideriSirket", "cobanGideriSirket", "amortismanGideriSirket"
      ],
      "Genel Parametreler": [
        "girisBedeli", "girisKDV", "sutFiyati", "sutKDV", "aylikSutMiktari", "yillikBuzagiGeliri", "buzagiKDV", "yemGideri", "yatirimciOdemeStopaj", "gelirVergisi"
      ]
    };

    return (
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {Object.entries(gruplar).map(([grupAdi, anahtarlar]) => (
          <div key={grupAdi} style={{ flex: 1 }}>
            <h4>{grupAdi}</h4>
            {anahtarlar.map((key) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", display: "block", marginBottom: "0.3rem" }}>
                  {aciklamalar[key] || key}
                </label>
                <input
                  type="number"
                  step="any"
                  name={key}
                  value={veri[key]}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #aaa", borderRadius: "4px" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderTablo = (baslik, obj) => (
    <div style={{ flex: 1, margin: "1rem" }}>
      <h3>{baslik}</h3>
      <table border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%", backgroundColor: "#fff" }}>
        <thead><tr><th>Açıklama</th><th>Tutar (₺)</th></tr></thead>
        <tbody>
          {Object.entries(obj).map(([key, value]) => (
            <tr key={key}><td>{key}</td><td>{value.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ textAlign: "center" }}>Vergi Simülasyonu</h2>
      {renderGroupedInputs()}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ width: "100%", textAlign: "center" }}><h2>Yatırımcı</h2></div>
        {Object.entries(yatirimci).map(([kategori, veri]) => renderTablo(kategori, veri))}
        <div style={{ width: "100%", textAlign: "center", marginTop: "3rem" }}><h2>Şirket</h2></div>
        {Object.entries(sirket).map(([kategori, veri]) => renderTablo(kategori, veri))}
      </div>
    </div>
  );
}

// Expose functions for Node or browser environments
if (typeof module !== 'undefined') {
  module.exports = { VergiSimulasyonuTablosu, varsayilanVeri, hesaplaYillikVeri };
}

// Expose component globally for the browser build
if (typeof window !== 'undefined') {
  window.VergiSimulasyonuTablosu = VergiSimulasyonuTablosu;
  window.varsayilanVeri = varsayilanVeri;
  window.hesaplaYillikVeri = hesaplaYillikVeri;
}
