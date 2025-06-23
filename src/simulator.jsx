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
  veterinerGideriYatirimci:
    "Yatırımcıya ait hayvan için aylık veteriner gideri (TL)",
  kiraGideriSirket: "Şirketin aylık çiftlik kira gideri (TL)",
  cobanGideriYatirimci: "Yatırımcıya ait hayvan için aylık çoban gideri (TL)",
  cobanGideriSirket: "Şirketin toplam çoban gideri (aylık, TL)",
  yatirimciOdemeStopaj: "Yatırımcıya yapılan ödeme için uygulanacak stopaj oranı (%)",
  gelirVergisi: "Net kâr üzerinden alınan gelir vergisi oranı (%)",
  inekSayisiSirket: "Şirketin sahip olduğu toplam inek sayısı",
  inekSayisiBireysel: "Bireysel yatırımcıya ait inek sayısı",
  inekSayisiKurumsal: "Kurumsal yatırımcıya ait inek sayısı",
  amortismanGideriSirket: "Şirketin yıllık amortisman gideri (TL)",
  toplamKapasite: "Çiftliğin toplam hayvan kapasitesi"
};

const varsayilanVeri = {
  girisBedeli: 150000,
  girisKDV: 20,
  sutFiyati: 18,
  sutKDV: 1,
  aylikSutMiktari: 300,
  yillikBuzagiGeliri: 50000,
  buzagiKDV: 1,
  yemGideri: 2000,
  veterinerGideriSirket: 150000,
  veterinerGideriYatirimci: 0,
  kiraGideriSirket: 150000,
  cobanGideriYatirimci: 500,
  cobanGideriSirket: 100000,
  yatirimciOdemeStopaj: 20,
  gelirVergisi: 23,
  inekSayisiSirket: 300,
  inekSayisiBireysel: 1,
  inekSayisiKurumsal: 0,
  amortismanGideriSirket: 60000,
  toplamKapasite: 300
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
  const veterinerGideri =
    tip === "sirket"
      ? veri.veterinerGideriSirket
      : veri.veterinerGideriYatirimci * hayvanSayisi * 12;
  const kiraGideri = tip === "sirket" ? veri.kiraGideriSirket : 0;
  const amortismanGideri = tip === "sirket" ? veri.amortismanGideriSirket : 0;

  const toplamGelir = yillikSutGeliri + yillikBuzagiGeliri;
  const toplamKDV = yillikSutKDV + yillikBuzagiKDV;
  const toplamGider = yemGideri + cobanGideri + veterinerGideri + kiraGideri + amortismanGideri;

  const ebitda = toplamGelir - (toplamGider - amortismanGideri);
  const ebit = ebitda - amortismanGideri;
  const gelirVergisi = ebit * (veri.gelirVergisi / 100);
  const netKar = ebit - gelirVergisi;

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
  const [ayarlarGoster, setAyarlarGoster] = useState(false);
  const yatirimciBireysel = hesaplaYillikVeri(
    veri,
    veri.inekSayisiBireysel,
    "yatirimci"
  );
  const yatirimciKurumsal = hesaplaYillikVeri(
    veri,
    veri.inekSayisiKurumsal,
    "yatirimci"
  );
  const sirket = hesaplaYillikVeri(
    veri,
    veri.inekSayisiSirket + veri.inekSayisiBireysel + veri.inekSayisiKurumsal,
    "sirket"
  );

  const bireyselStopaj =
    yatirimciBireysel.KarZarar["Net Kâr"] * (veri.yatirimciOdemeStopaj / 100);
  const yatirimciStopaj = bireyselStopaj;

  const devletOdemeleri = {
    "Ödenecek KDV": sirket.KDVTablosu["Ödenecek KDV"],
    "Gelir Vergisi": sirket.KarZarar["Gelir Vergisi"],
    "Yatırımcı Stopajı": yatirimciStopaj,
    "Toplam Ödeme":
      sirket.KDVTablosu["Ödenecek KDV"] +
      sirket.KarZarar["Gelir Vergisi"] +
      yatirimciStopaj
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = parseFloat(value) || 0;
    if (
      ["inekSayisiBireysel", "inekSayisiKurumsal", "inekSayisiSirket"].includes(
        name
      )
    ) {
      const others =
        veri.inekSayisiBireysel +
        veri.inekSayisiKurumsal +
        veri.inekSayisiSirket -
        veri[name];
      const maxAllowed = veri.toplamKapasite - others;
      if (val > maxAllowed) val = maxAllowed;
      if (val < 0) val = 0;
    }
    setVeri({ ...veri, [name]: val });
  };

  const renderGroupedInputs = () => {
    const gruplar = {
      "Yatırımcı Parametreleri": [
        "inekSayisiBireysel",
        "inekSayisiKurumsal",
        "cobanGideriYatirimci",
        "veterinerGideriYatirimci"
      ],
      "Şirket Parametreleri": [
        "inekSayisiSirket",
        "veterinerGideriSirket",
        "kiraGideriSirket",
        "cobanGideriSirket",
        "amortismanGideriSirket"
      ],
      "Genel Parametreler": [
        "girisBedeli",
        "sutFiyati",
        "aylikSutMiktari",
        "yillikBuzagiGeliri",
        "yemGideri"
      ]
    };

    const ayarAlanlari = [
      "girisKDV",
      "sutKDV",
      "buzagiKDV",
      "yatirimciOdemeStopaj",
      "gelirVergisi",
      "toplamKapasite"
    ];

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          {Object.entries(gruplar).map(([grupAdi, anahtarlar]) => (
            <div
              key={grupAdi}
              style={{
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0" }}>{grupAdi}</h4>
              {anahtarlar.map((key) => (
                <div key={key} style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "0.3rem"
                    }}
                  >
                    {aciklamalar[key] || key}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={key}
                    value={veri[key]}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          <div>
            <button
              onClick={() => setAyarlarGoster(!ayarlarGoster)}
              style={{
                marginBottom: "0.5rem",
                padding: "0.5rem 1rem",
                border: "none",
                background: "#007bff",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {ayarlarGoster ? "Ayarları Gizle" : "Ayarları Göster"}
            </button>
            {ayarlarGoster && (
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Ayarlar</h4>
                {ayarAlanlari.map((key) => (
                  <div key={key} style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "0.3rem"
                      }}
                    >
                      {aciklamalar[key] || key}
                    </label>
                    <input
                      type="number"
                      step="any"
                      name={key}
                      value={veri[key]}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px"
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
  };

  const renderTablo = (baslik, obj) => (
    <div
      style={{
        flex: 1,
        margin: "1rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <h3 style={{ textAlign: "center" }}>{baslik}</h3>
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Açıklama</th>
            <th>Tutar (₺)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(obj).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>
                {value.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ padding: "1rem", maxWidth: "1600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>Vergi Simülasyonu</h2>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "2rem",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            flex: "0 0 450px",
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          {renderGroupedInputs()}
        </div>
        <div style={{ flex: 1, maxHeight: "80vh", overflowY: "auto" }}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <h2>Bireysel Yatırımcı</h2>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {Object.entries(yatirimciBireysel).map(([kategori, veri]) =>
              renderTablo(kategori, veri)
            )}
          </div>
          <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
            <h2>Kurumsal Yatırımcı</h2>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {Object.entries(yatirimciKurumsal).map(([kategori, veri]) =>
              renderTablo(kategori, veri)
            )}
          </div>
          <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
            <h2>Şirket</h2>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {Object.entries(sirket).map(([kategori, veri]) =>
              renderTablo(kategori, veri)
            )}
          </div>
          <div style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}>
            <h2>Devlete Ödemeler</h2>
          </div>
          <div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
          >
            {renderTablo("Devlet Ödemeleri", devletOdemeleri)}
          </div>
        </div>
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
