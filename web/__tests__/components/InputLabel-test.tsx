import { InputText } from '@/components/Inputs/InputText';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('InputText', () => {
  it('renderiza label e placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <InputText label="Nome" placeholder="Digite seu nome" />
    );

    expect(getByText('Nome')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
  });

  it('chama onChangeText no input padrão', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <InputText placeholder="Email" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'teste@exemplo.com');
    expect(onChangeText).toHaveBeenCalledWith('teste@exemplo.com');
  });

  it('mostra erro quando fornecido', () => {
    const { getByText } = render(<InputText placeholder="Senha" error="Campo obrigatório" />);

    expect(getByText('Campo obrigatório')).toBeTruthy();
  });
});
