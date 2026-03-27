import pandas as pd
import numpy as np

np.random.seed(42)

n_samples = 600

voltage = np.random.uniform(210, 250, n_samples)
current = np.random.uniform(0.5, 10, n_samples)
temperature = np.random.uniform(25, 85, n_samples)
humidity = np.random.randint(20, 81, n_samples)
smoke = np.random.randint(100, 601, n_samples)

fire_risk = []
for i in range(n_samples):
    if (temperature[i] > 65 and smoke[i] > 400) or (current[i] > 8 and voltage[i] > 240):
        fire_risk.append('HIGH')
    elif temperature[i] > 50 or smoke[i] > 300 or current[i] > 6:
        fire_risk.append('MEDIUM')
    else:
        fire_risk.append('LOW')

df = pd.DataFrame({
    'voltage': voltage,
    'current': current,
    'temperature': temperature,
    'humidity': humidity,
    'smoke': smoke,
    'fire_risk': fire_risk
})

df.to_csv('fire_risk_dataset.csv', index=False)
print("Dataset generated successfully: fire_risk_dataset.csv")