# __define-ocg__
import matplotlib.pyplot as plt

varOcg_metrics = ['Wait Time', 'Table Turnover']
varOcg_manual = [15, 30]
varOcg_system = [5, 20]

x = range(len(varOcg_metrics))

plt.figure()
plt.bar(x, varOcg_manual, label='Manual')
plt.bar(x, varOcg_system, bottom=varOcg_manual, label='Zero-Contact')

plt.xticks(x, varOcg_metrics)
plt.ylabel('Time (minutes)')
plt.title('Figure 4.4: Table and Queue Efficiency')
plt.legend()
plt.show()
plt.savefig("images/figure4_4.png")