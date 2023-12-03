import React from "react";
import './Settings.css'

const Settings = () => {
    return (
        <div className="settings">
            <header className="settings-header">
                <h1>Configurações</h1>
                <button type="button" className="settings-back">Voltar</button>
            </header>
            <main className="settings-main">
                <ul className="settings-list">
                    <li className="settings-item">
                        <a href="#">Meu Perfil</a>
                    </li>
                    <li className="settings-item">
                        <a href="#">Notificações</a>
                    </li>
                    <li className="settings-item">
                        <a href="#">Meus Relatórios</a>
                    </li>
                    <li className="settings-item">
                        <a href="#">Meus Plantios</a>
                    </li>
                    <li className="settings-item">
                        <a href="#">Definições de Plantio</a>
                    </li>
                    <li className="settings-item">
                        <a href="#">Ajuda</a>
                    </li>
                    <li className="settings-item">
                        <a href="#">Termos de Serviço</a>
                    </li>
                </ul>
            </main>
            <footer className="settings-footer">
                <p>versão 1.0.0</p>
            </footer>
        </div>
    );
};

export default Settings;
