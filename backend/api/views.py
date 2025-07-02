from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework import status
from rest_framework.response import Response
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import os
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score


class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']

            #Fetch the data from yfinance
            now = datetime.now()
            start= datetime(now.year-10, now.month, now.day)
            end = now
            df = yf.download(ticker, start, end)
            if df.empty:
                return Response({'error': 'No data found for the given ticker.',
                                 'status': status.HTTP_404_NOT_FOUND})
            df = df.reset_index()

            # Generate basic plot
            plt.switch_backend('AGG')
            plt.figure(figsize = (12,5))
            plt.plot(df.Close, label = 'Closing price')
            plt.title(f'Closing price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()

            #Save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            plot_img = save_plot(plot_img_path)

            # 100 Days moving average
            ma100 = df[('MA_100', ticker)] = df[('Close', ticker)].rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize = (12,5))
            plt.plot(df.Close, label = 'Closing price')
            plt.plot(ma100, 'r', label = '100 Days moving average')
            plt.title(f'100 Days moving average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_img_path = f'{ticker}_100_dma.png'
            plot_100_dma = save_plot(plot_img_path)

            # 200 Days moving average
            ma200 = df[('MA_100', ticker)] = df[('Close', ticker)].rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize = (12,5))
            plt.plot(df.Close, label = 'Closing price')
            plt.plot(ma100, 'r', label = '100 Days moving average')
            plt.plot(ma200, 'g', label = '200 Days moving average')
            plt.title(f'200 Days moving average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_img_path = f'{ticker}_200_dma.png'
            plot_200_dma = save_plot(plot_img_path)

            # Splitting data into training and testing datasets
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))])

            # Scaling down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))

            # Load ML Model
            project_root = os.path.dirname(settings.BASE_DIR)
            model_path = os.path.join(project_root, 'Resources', 'stock_prediction_model.keras')
            model = load_model(model_path)

            # Prepare test data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)
            x_test = []
            y_test = []
            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i])
            x_test, y_test = np.array(x_test), np.array(y_test)

            # Make Predictions
            y_predicted = model.predict(x_test)

            # Revert the scale prices to original prices
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()

            # Plot the final prediction
            plt.switch_backend('AGG')
            plt.figure(figsize = (12,5))
            plt.plot(y_test, 'b', label = 'Original price')
            plt.plot(y_predicted, 'r', label = 'Predicted price')
            plt.title(f'Final prediction for {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_img_path = f'{ticker}_final_prediction.png'
            plot_prediction = save_plot(plot_img_path)

            # Model Evaluetion
            # Mean Squared Error (MSE)
            mse = mean_squared_error(y_test, y_predicted)

            # Root mean Squared Error (RMSE)
            rmse = np.sqrt(mse)

            # R - squared
            r2 = r2_score(y_test, y_predicted)



            return Response({
                'status': 'success',
                'plot_img': plot_img,
                'plot_100_dma': plot_100_dma,
                'plot_200_dma': plot_200_dma,
                'plot_prediction': plot_prediction,
                'mse': mse,
                'rmse': rmse,
                'r2': r2
                })
