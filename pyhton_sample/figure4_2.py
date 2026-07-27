# __define-ocg__
import matplotlib.pyplot as plt

varOcg_stages = ['Menu Access', 'Order Placement', 'Payment', 'Total']
varOcg_manual = [5, 8, 4, 17]
varOcg_system = [1, 2, 1, 4]

x = range(len(varOcg_stages))

plt.figure()
plt.bar(x, varOcg_manual, label='Manual')
plt.bar(x, varOcg_system, bottom=varOcg_manual, label='Zero-Contact')

plt.xticks(x, varOcg_stages)
plt.ylabel('Time (minutes)')
plt.title('Figure 4.2: Order Processing Time Comparison')
plt.legend()
plt.show()
plt.savefig("figure4_2.png")