import React, { useState, useEffect } from 'react'
import moment from 'moment'

import income from '../../assets/income.svg'
import outcome from '../../assets/outcome.svg'
import total from '../../assets/total.svg'

import api from '../../services/api'

import Header from '../../components/Header'

import formatValue from '../../utils/formatValue'

import { Container, CardContainer, Card, TableContainer } from './styles'

interface Transaction {
  id: string
  title: string
  value: number
  formattedValue: string
  formattedDate: string
  type: 'income' | 'outcome'
  category: { title: string }
  created_at: Date
}

interface Balance {
  income: number
  outcome: number
  total: number
}

interface ReponseTransaction {
  transactions: Transaction[]
  balance: Balance
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<Balance>({} as Balance)

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<ReponseTransaction>(`transactions`)

      setTransactions(response.data.transactions)
      setBalance(response.data.balance)
    }
    loadTransactions()
  }, [])

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactions.map(transition => (
              <tbody key={transition.id}>
                <tr>
                  <td className="title">{transition.title}</td>
                  <td className={transition.type}>
                    {transition.type === 'outcome' ? '- ' : ''}
                    {formatValue(transition.value)}
                  </td>
                  <td>{transition.category.title}</td>
                  <td>{moment(transition.created_at).format('D/MM/YYYY')}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </TableContainer>
      </Container>
    </>
  )
}

export default Dashboard
