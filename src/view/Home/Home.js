import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const storedEmail = localStorage.getItem('savedEmail');
    const storedPassword = localStorage.getItem('savedPassword');


    if (!storedEmail || !storedPassword) {
        navigate('/login');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
    }

    const [isLoading, setIsLoading] = useState(true);
    const [plantData, setPlantData] = useState(null);


    const fetchData = async () => {
        try {
            if (storedEmail && storedPassword) {
                const response = await axios.post('https://api.agro4u.life/api/v1/auth/login', {
                    email: storedEmail,
                    password: storedPassword,
                });

                setPlantData(response.data);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            navigate('/login');
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
            console.error('Erro ao obter os dados do plantio:', error);
            setIsLoading(false);
        }
    };

    // UseEffect para buscar os dados quando o componente montar
    useEffect(() => {
        fetchData();

        // Configura um intervalo para buscar os dados a cada 5 minutos (ajuste conforme necessário)
        const intervalId = setInterval(() => {
            fetchData();
        }, 60 * 1000); // 5 minutos

        // Limpa o intervalo ao desmontar o componente
        return () => clearInterval(intervalId);
    }, []);

    if (isLoading) {
        return (
            <div className="loading-container">
                <ClipLoader color="#00c44b" loading={isLoading} css="margin: auto; border-color: #00c44b;" size={50} />
            </div>
        );
    }

    function umidadeRelativa(valorAnalogico) {
        const valorMaximo = 1023;
        const voltagem = (valorAnalogico / valorMaximo) * 5.0;
        const { valorMinimoCalibrado, valorMaximoCalibrado } = {
            valorMinimoCalibrado: 0.5,
            valorMaximoCalibrado: 4.5,
        };
        const umidadeCalibrada =
            ((voltagem - valorMinimoCalibrado) /
                (valorMaximoCalibrado - valorMinimoCalibrado)) *
            100;
        // Inverte a porcentagem subtraindo o valor de 100
        const umidadeInvertida = 100 - umidadeCalibrada;
        return Math.min(Math.max(umidadeInvertida, 0), 100).toFixed(1);
    }


    const dataTempoReal = plantData?.userData[0].data.dados.tempoReal;

    const UA = dataTempoReal?.UA.toFixed(1) + '%';
    const TP = dataTempoReal?.TP.toFixed(1) + ' ºC';
    const MS = umidadeRelativa(dataTempoReal?.MS) + '%';
    const HR = dataTempoReal?.HR.split(':').slice(0, 2).join('h');
    const DY = dataTempoReal?.DAY;

    const generatePDF = () => {
        const pdf = new jsPDF();

        // Adiciona imagem do logo centralizada
        const logoPath = "/images/logo-agro4u.png"; // Substitua pelo caminho real para o seu logo
        const logoWidth = 250 / 5;
        const logoHeight = 65 / 5;
        const logoX = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
        const logoY = 20;
        pdf.addImage(logoPath, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Adiciona título
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor("#00796b"); // Verde escuro
        pdf.text('Seu Relatório de Plantio', pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 10, { align: 'center' });


        // Adiciona informações do plantio
        pdf.setFont("helvetica");
        pdf.setFontSize(14);
        pdf.setTextColor("#2e7d32"); // Verde médio
        pdf.text(`Tipo de Plantio: Alface`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 25, { align: 'center' });
        pdf.text(`Idade do Plantio: 8 semanas`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 35, { align: 'center' });
        pdf.text(`Temperatura do Ar: ${TP}`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 45, { align: 'center' });
        pdf.text(`Temperatura do Solo: ${TP}`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 55, { align: 'center' });
        pdf.text(`Umidade do Ar: ${UA}`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 65, { align: 'center' });
        pdf.text(`Umidade do Solo: ${MS}`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 75, { align: 'center' });

        // Adiciona data e hora de geração do relatório
        pdf.setFont("helvetica");
        const dataHoraGeracao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const [dataGeracao, horaGeracao] = dataHoraGeracao.split(', ');
        pdf.setTextColor("#616161"); // Cinza
        pdf.text(`Relatório gerado em: ${dataGeracao}, ${horaGeracao.split(':').slice(0, 2).join('h')}`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 95, { align: 'center' });

        // Adiciona data e hora de atualização dos dados
        pdf.setFont("helvetica");
        const dataHoraAtualizacao = `${DY}, ${HR}`; // Substitua pela data e hora reais
        pdf.text(`Dados atualizados em: ${dataHoraAtualizacao}`, pdf.internal.pageSize.getWidth() / 2, logoY + logoHeight + 105, { align: 'center' });

        // Salva o PDF
        pdf.save(`RelatorioPlantio_${Date.now().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.pdf`);
    };

    return (
        <div className="home-container">
            <div className="header">
                <div className="logo-container">
                    <img src="/images/vector-planta.png" alt="Logo" />
                </div>
                <div className="title-container">
                    <h2>Início</h2>
                </div>
                <div className="icon-bell-container">
                    <img src="/images/icon-sino.png" alt="Ícone" className="icon-bell" />
                </div>
            </div>

            <div className="planting-component">
                <div className="plant-icon">
                    <img src="/images/icon-planta-black.png" alt="Logo" />
                </div>
                <div className="plant-info">
                    <h2>Plantio de Alface</h2>
                    <h3>Idade</h3>
                    <p>8 semanas</p>
                </div>
            </div>

            <div className="climate-components">
                <div className="temperature-component">
                    <div className="temperature-title">
                        <h2>Temperatura</h2>
                    </div>
                    <div className="temperature-info">
                        <div className="temperature-icon">
                            <img src="/images/icon-termometro.png" alt="Logo" />
                        </div>
                        <p>
                            <b>Ar </b>
                            {TP}
                        </p>
                        <p>
                            <b>Solo </b>
                            {TP}
                        </p>
                    </div>
                </div>

                <div className="humidity-component">
                    <div className="humidity-title">
                        <h2>Umidade</h2>
                    </div>
                    <div className="humidity-info">
                        <div className="humidity-icon">
                            <img src="/images/icon-gota.png" alt="Logo" />
                        </div>
                        <p>
                            <b>Ar </b>
                            {UA}
                        </p>
                        <p>
                            <b>Solo </b>
                            {MS}
                        </p>
                    </div>
                </div>
            </div>

            <div className="pdf-button-container">
                <button className="green-button" onClick={generatePDF}>
                    Meu Relatório de Plantio
                </button>
            </div>

            <div className="update-info">
                <div className="update-icon">
                    <img src="/images/icone-atualizado.png" alt="Ícone de atualização" />
                </div>
                <p>Dados atualizados em {HR} {DY}</p>
            </div>
        </div>
    );
};

export default Home;
