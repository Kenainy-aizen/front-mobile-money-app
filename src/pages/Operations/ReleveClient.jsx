import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Search, Download, Calendar, User, Phone } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const ReleveClient = () => {
    // États pour la recherche
    const [numTel, setNumTel] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    
    // Données du relevé
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchReleve = async () => {
        if (!numTel) return toast.error("Entrez un numéro de téléphone");
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/v1/clients/reports/${numTel}?month=${month}&year=${year}`,
                { headers }
            );
            setData(response.data);
        } catch (err) {
            toast.error("Données introuvables pour ce client");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // Fonction de génération du PDF (Style identique à ta photo)
    const generatePDF = () => {
        if (!data) return;

        const doc = new jsPDF();
        const nomMois = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(year, month - 1));

        // 1. En-tête : Date (centré)
        doc.setFontSize(12);
        doc.text(`Date : ${nomMois.charAt(0).toUpperCase() + nomMois.slice(1)} ${year}`, 105, 20, { align: 'center' });

        // 2. Infos Client (aligné à gauche)
        doc.setFontSize(11);
        doc.text(`Contact : ${data.contact}`, 20, 35);
        doc.setFont("helvetica", "bold");
        doc.text(`${data.nomComplet.toUpperCase()}`, 20, 43);
        doc.setFont("helvetica", "normal");
        doc.text(`${data.age} ans`, 20, 51);
        doc.text(`Masculin`, 20, 59); // Tu peux rendre ça dynamique si ton API le fournit

        // 3. Solde actuel
        doc.text(`Solde actuel : ${Number(data.soldeActuel).toLocaleString('de-DE')} Ariary`, 20, 70);

        // 4. Tableau des transactions
        const tableBody = data.transactions.map(t => [
            new Date(t.date).toLocaleDateString('fr-FR'),
            t.raison || '',
            t.debit > 0 ? Number(t.debit).toLocaleString('de-DE') : '',
            t.credit > 0 ? Number(t.credit).toLocaleString('de-DE') : ''
        ]);

        autoTable(doc, {
            startY: 75,
            head: [['Date', 'Raison', 'Débit', 'Crédit']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1 },
            styles: { textColor: [0, 0, 0], fontSize: 10, cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 80 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40 },
            }
        });

        // 5. Totaux (après le tableau)
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFont("helvetica", "bold");
        doc.text(`Total Débit : ${Number(data.totalDebit).toLocaleString('de-DE')} Ar`, 20, finalY);
        doc.text(`Total Crédit : ${Number(data.totalCredit).toLocaleString('de-DE')} Ar`, 20, finalY + 8);

        // Téléchargement
        doc.save(`Releve_${data.contact}_${month}_${year}.pdf`);
    };

    return (
        <div className="ml-64 p-8 bg-[#0f172a] min-h-screen flex-1 text-slate-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Relevé de Compte</h1>
                    <p className="text-slate-500 text-sm">Génération de rapports mensuels PDF</p>
                </div>
            </div>

            {/* Filtres de recherche */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl mb-8 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Numéro Client</label>
                    <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 pl-10 text-white outline-none focus:border-blue-500" 
                               value={numTel} onChange={(e) => setNumTel(e.target.value)} placeholder="033xxxxxxx" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Mois</label>
                    <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none"
                            value={month} onChange={(e) => setMonth(e.target.value)}>
                        {Array.from({length: 12}, (_, i) => (
                            <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('fr-FR', {month: 'long'})}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Année</label>
                    <input type="number" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none"
                           value={year} onChange={(e) => setYear(e.target.value)} />
                </div>

                <button onClick={fetchReleve} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
                    {loading ? "Chargement..." : <><Search size={20}/> Rechercher</>}
                </button>
            </div>

            {/* Aperçu et Bouton PDF */}
            {data && (
                <div className="bg-white text-black p-10 rounded-lg max-w-4xl mx-auto shadow-2xl overflow-hidden animate-in fade-in duration-500">
                    <div className="flex justify-end mb-4 no-print">
                        <button onClick={generatePDF} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                            <Download size={18}/> Télécharger PDF
                        </button>
                    </div>
                    
                    {/* Simulation visuelle du relevé (comme ta photo) */}
                    <div className="text-center mb-8 border-b pb-4">
                        <p className="text-sm">Date : {new Intl.DateTimeFormat('fr-FR', {month: 'long'}).format(new Date(year, month - 1))} {year}</p>
                    </div>

                    <div className="mb-6 space-y-1">
                        <p className="text-sm">Contact : {data.contact}</p>
                        <p className="font-bold text-lg">{data.nomComplet.toUpperCase()}</p>
                        <p className="text-sm">{data.age} ans</p>
                        <p className="text-sm">Masculin</p>
                        <p className="mt-4 font-semibold">Solde actuel : {Number(data.soldeActuel).toLocaleString('de-DE')} Ariary</p>
                    </div>

                    <table className="w-full border-collapse border border-black mb-6">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-2 text-left">Date</th>
                                <th className="border border-black p-2 text-left">Raison</th>
                                <th className="border border-black p-2 text-left">Débit</th>
                                <th className="border border-black p-2 text-left">Crédit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.transactions.map((t, i) => (
                                <tr key={i}>
                                    <td className="border border-black p-2">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="border border-black p-2">{t.raison}</td>
                                    <td className="border border-black p-2">{t.debit > 0 ? t.debit.toLocaleString() : ''}</td>
                                    <td className="border border-black p-2">{t.credit > 0 ? t.credit.toLocaleString() : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="font-bold space-y-1">
                        <p>Total Débit : {data.totalDebit.toLocaleString()} Ar</p>
                        <p>Total Crédit : {data.totalCredit.toLocaleString()} Ar</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReleveClient;