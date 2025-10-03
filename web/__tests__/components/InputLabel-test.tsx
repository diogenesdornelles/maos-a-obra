import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { InputLabel } from '../../src/components/InputLabel/InputLabel';

describe('InputLabel', () => {
  it('renderiza label e placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputLabel label="Nome" placeholder="Digite seu nome" />
    );

    expect(getByText('Nome')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
  });

  it('chama onChangeText no input padrão', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputLabel placeholder="Email" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'teste@exemplo.com');
    expect(onChangeText).toHaveBeenCalledWith('teste@exemplo.com');
  });

  it('mostra erro quando fornecido', () => {
    const { getByText } = render(<InputLabel placeholder="Senha" error="Campo obrigatório" />);

    expect(getByText('Campo obrigatório')).toBeTruthy();
  });

  it('usa placeholder padrão no modo data', () => {
    const { getByPlaceholderText } = render(<InputLabel type="date" />);
    expect(getByPlaceholderText('Selecione uma data')).toBeTruthy();
  });
});
