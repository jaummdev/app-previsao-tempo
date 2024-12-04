import { Button, Input } from "@mui/material";
import { useState, useRef } from "react";
import { BarLoader } from "react-spinners";

export default function Search() {
    const API_ID = "03cc505899fa1b4311d15358060d29ed";

    const [cidade, setCidade] = useState(null);
    const [icon, setIcon] = useState("");
    const [loading, setLoading] = useState(false)
    const inputRef = useRef();

    function searchInput(e) {
        e.preventDefault();
        setCidade(null);
        setLoading(true)

        const currentValue = inputRef.current.value;

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentValue}&appid=${API_ID}&units=metric&lang=pt_br`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados");
                }
                return response.json();
            })
            .then(data => {
                if (data && data.weather && data.main) {
                    const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.weather[0]["icon"]}.svg`;
                    setCidade(data);
                    setIcon(iconUrl);
                    setLoading(false)
                } else {
                    setCidade(null);
                    setLoading(false)
                }
            })
            .catch(error => console.error("Erro ao buscar dados da API:", error));
    }

    return (
        <div className="search-container">
            <div className="search">
                <h1>🌧️🌤️ Digite a cidade para saber sobre o clima 🌧️🌤️</h1>
                <form onSubmit={searchInput}>
                    <Input
                        inputRef={inputRef}
                        className="input-search"
                        placeholder="Digite a cidade..."
                        name="search"
                    />
                    <Button size="large" variant="contained" type="submit">Pesquisar</Button>
                </form>
            </div>

            {loading ? (
                <BarLoader color="white" />
            ) : (
                <div className="search-result">
                    {cidade ? (
                        <section>
                            <div>
                                <h1>{cidade.name}</h1>
                                <p>{cidade.weather[0].description}</p>
                                <h2>{cidade.main.temp}<span>°C</span></h2>
                            </div>
                            <img src={icon} alt="Ícone do clima" />
                        </section>
                    ) : (
                        <div>Nenhum resultado encontrado...</div>
                    )}
                </div>
            )}
        </div>
    );
}
