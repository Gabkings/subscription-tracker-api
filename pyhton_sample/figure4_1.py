import matplotlib.pyplot as plt

varOcg_functions = [
    'User Login', 'QR Code Scan', 'Order Placement',
    'Payment Processing', 'Table Allocation', 'Queue Management'
]

varOcg_results = [1, 1, 1, 1, 1, 1]  # 1 = Pass

plt.figure()
plt.bar(varOcg_functions, varOcg_results)
plt.ylabel('Test Result (1=Pass)')
plt.title('Figure 4.1: Functional Testing Results')
plt.xticks(rotation=30)
plt.show()
plt.savefig("figure4_1.png")