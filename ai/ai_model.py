import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error
from datetime import datetime, timedelta

def handle_new_data(new_data):
    print(f"Incoming data: {new_data}")  

    if not isinstance(new_data, list) or len(new_data) == 0 or not all(isinstance(item, dict) for item in new_data):
        return {'error': 'Invalid data format. Expected a non-empty list of dictionaries.'}

    required_columns = ['Date', 'Tested and Safe Count', 'Expired Count', 'Unavailable Matches Count', 'Transfused Count']
    for column in required_columns:
        if column not in new_data[0]:
            return {'error': f'Missing required column: {column}'}

    try:
        df = pd.DataFrame(new_data)
        print(f"DataFrame created: {df}") 
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)

        df['Day'] = df.index.day
        df['Month'] = df.index.month

        target = 'Transfused Count'
        features = ['Tested and Safe Count', 'Expired Count', 'Unavailable Matches Count', 'Day', 'Month']

        for col in features:
            df[col] = pd.to_numeric(df[col], errors='coerce')

        arima_data = df[target].dropna() 

        if arima_data.empty:
            raise ValueError("Target column 'Transfused Count' has no valid data.")

        if arima_data.ndim != 1:
            raise ValueError("ARIMA expects a 1-dimensional array, but got a different shape.")

        arima_model = ARIMA(arima_data, order=(5, 1, 0))
        arima_result = arima_model.fit()
        arima_forecast = arima_result.forecast(steps=30)  


        df_arima_forecast = pd.DataFrame({
            "Date": [df.index[-1] + timedelta(days=i) for i in range(1, 31)],
            target: arima_forecast
        })
        df_arima_forecast.set_index('Date', inplace=True)

   
        X = df[features].dropna()  
        y = df[target].dropna() 

        if X.empty or y.empty:
            raise ValueError("Features or target column have missing values after cleaning.")

        gb_model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=3, random_state=42)
        gb_model.fit(X, y)

        current_month_data = pd.DataFrame({
            "Tested and Safe Count": np.random.randint(50, 100, size=30),
            "Expired Count": np.random.randint(0, 20, size=30),
            "Unavailable Matches Count": np.random.randint(5, 20, size=30),
            "Day": list(range(1, 31)),
            "Month": [df.index[-1].month + 1] * 30
        })
        current_month_data[target] = gb_model.predict(current_month_data)

        monthly_prediction = current_month_data[target].sum()


        result = {
            "arima_forecast": df_arima_forecast.to_dict(orient='index'),
            "predicted_total_blood_bags_requirement": monthly_prediction
        }

        return result
    except Exception as e:
        return {'error': str(e)}
