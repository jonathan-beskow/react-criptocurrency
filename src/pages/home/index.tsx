import { useEffect, useState, type FormEvent } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import styles from './home.module.css';


interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
}

interface DataProp {
  data: CoinProps[];
}




export function Home() {

  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const navigate = useNavigate();

  

  async function getData() {
    const baseUrl = import.meta.env.VITE_API_URL;
    const token = import.meta.env.VITE_API_TOKEN;
    const url = `${baseUrl}?limit=10`;

    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    fetch(url, options)
      .then(response => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data;
        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        })
        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: price.format(Number(item.marketCapUsd))
          }
          return formated;
        })
        console.log(formatedResult);
      })
  }

  useEffect(() => { getData() }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;
    const link = `/detail/${input}`;
    navigate(link);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF"></BsSearch>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor de mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
            <th scope='col'>Mudança em 24h</th>
          </tr>
        </thead>
        <tbody id="tbody">
          <tr className={styles.tr}>
            <td className={styles.tdLabel} data-label="Moeda">
              <div>
                <Link to="/detail/bitcoin">
                  <span>Bitcoin</span> | BTC
                </Link>
              </div>
            </td>
            <td className={styles.tdLabel} data-label="Valor mercado">
              1T
            </td>
            <td className={styles.tdLabel} data-label="Preço">
              8.000
            </td>
            <td className={styles.tdLabel} data-label="Volume">
              2B
            </td>
            <td className={styles.tdLabel} data-label="Mudança 24h">
              <span>1.20</span>
            </td>
          </tr>
        </tbody>
      </table>

      <button>
        Carregar mais...
      </button>

    </main>
  )
}

