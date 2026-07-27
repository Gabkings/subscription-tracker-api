# __define-ocg__
import matplotlib.pyplot as plt

varOcg_labels = ['Ease of Use', 'Order Accuracy', 'Speed', 'Overall']
varOcg_values = [4.7, 4.8, 4.6, 4.7]

plt.figure()
plt.pie(varOcg_values, labels=varOcg_labels, autopct='%1.1f')
plt.title('Figure 4.3: Customer Satisfaction Ratings')
plt.show()
plt.savefig("figure4_3.png")