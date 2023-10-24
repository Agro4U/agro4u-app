import React, { useState } from 'react';
import Modal from 'react-modal';
import './Notifications.css';

const Notifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Exemplo de dados de notificação
  const notifications = [
    'Nova mensagem recebida',
    'Pedido enviado com sucesso',
    'Atualização disponível. Clique para instalar.',
  ];

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Notificações"
      className="notifications-modal"
      overlayClassName="notifications-overlay"
    >
      <h2>Notificações</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
      <button onClick={closeModal}>Fechar</button>
    </Modal>
  );
};

export default Notifications;
