// LoginForm.js

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

Modal.setAppElement('#root');

const LoginForm = () => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem('savedEmail');
  const storedPassword = localStorage.getItem('savedPassword');

  if (storedEmail || storedPassword) {
    navigate('/home');
  } else {
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');
  }

  useEffect(() => {
    // Verifica se há credenciais salvas e preenche os campos se existirem
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setIsCheckboxChecked(true);
    }
  }, []);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !isCheckboxChecked) {
      setIsModalOpen(true);
    } else {
      try {
        const response = await axios.post('https://api.agro4u.life/api/v1/auth/login', {
          email,
          password,
        });

        console.log('Dados do usuário:', response.data);

        if (response.status === 200) {
          if (isCheckboxChecked) {
            // Salva as credenciais no localStorage
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
          }

          // Navega para a tela "Home" em caso de sucesso
          navigate('/home');
        }

      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsModalOpen(true);
        } else {
          console.error('Erro ao fazer a solicitação:', error);
        }
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-form-container">
      <div className="logo-container">
        <img src="/images/logo-agro4u.png" alt="Logo" />
      </div>
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            placeholder="**********"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={isCheckboxChecked}
            onChange={handleCheckboxChange}
          />
          <label>
            Eu li e aceito os <span className="terms-link">Termos e Condições</span>.
          </label>
        </div>
        <button type="submit">Continuar com Email</button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Erro"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h3>Erro</h3>
          {!email.trim() && <p>O campo de e-mail não pode estar vazio.</p>}
          {email.trim() && !isValidEmail(email) && (
            <p>O formato do e-mail não é válido.</p>
          )}
          {!password.trim() && <p>O campo de senha não pode estar vazio.</p>}
          {!isCheckboxChecked && <p>Você deve aceitar os Termos e Condições.</p>}
          <button onClick={closeModal}>Fechar</button>
        </Modal>
      </form>
    </div>
  );
};

export default LoginForm;
