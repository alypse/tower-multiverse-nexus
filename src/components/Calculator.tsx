import './Calculator.scss';

// For his skyeness
// if (totalCooldown === 300) { console.log("cds nutz. gottem."); }

export function Calculator({props}) {
    return (
        <div className="main">
            <div className="results">
                <div className="result">
                    <p>Total Cooldown</p>
                    <p>{props.totalCooldown} seconds</p>
                </div>
                <div className="result">
                    <p>Average Cooldown</p>
                    <p>{props.averageCooldown.toFixed(2)} seconds</p>
                </div>
                <div className="result">
                    <p>Average Cooldown with Effect</p>
                    <p>{props.averageCooldownwithMN.toFixed(2)} seconds</p>
                </div>
            </div>
        </div>
    );
}
