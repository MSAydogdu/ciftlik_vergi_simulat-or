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
@@ -157,25 +158,32 @@ export default function VergiSimulasyonuTablosu() {
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

export { varsayilanVeri, hesaplaYillikVeri };

// Expose component globally for the browser build
if (typeof window !== 'undefined') {
  window.VergiSimulasyonuTablosu = VergiSimulasyonuTablosu;
  window.varsayilanVeri = varsayilanVeri;
  window.hesaplaYillikVeri = hesaplaYillikVeri;
}