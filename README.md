//BFS HPC-1

#include <iostream>
#include <queue>
#include <omp.h>
using namespace std;

class node {
public:
    int data;
    node *left, *right;

    node(int d) {
        data = d;
        left = right = NULL;
    }
};

node* insert(node* root, int data) {

    if (!root)
        return new node(data);

    queue<node*> q;
    q.push(root);

    while (!q.empty()) {

        node* temp = q.front();
        q.pop();

        if (!temp->left) {
            temp->left = new node(data);
            return root;
        }
        else
            q.push(temp->left);

        if (!temp->right) {
            temp->right = new node(data);
            return root;
        }
        else
            q.push(temp->right);
    }
    return root;
}

void bfs(node* root) {

    queue<node*> q;
    q.push(root);

    while (!q.empty()) {

        int n = q.size();

        #pragma omp parallel for
        for (int i = 0; i < n; i++) {

            node* temp;

            #pragma omp critical
            {
                temp = q.front();
                q.pop();

                cout << temp->data << " ";
            }

            #pragma omp critical
            {
                if (temp->left)
                    q.push(temp->left);

                if (temp->right)
                    q.push(temp->right);
            }
        }
    }
}

int main() {

    node* root = NULL;
    int x;
    char ch;

    do {
        cout << "Enter data: ";
        cin >> x;

        root = insert(root, x);

        cout << "More nodes? (y/n): ";
        cin >> ch;

    } while (ch == 'y' || ch == 'Y');

    cout << "\nBFS Traversal:\n";
    bfs(root);

    return 0;
}
//DFS HPC-2
//DFS HPC 2

#include <iostream>
#include <vector>
#include <stack>
#include <omp.h>
using namespace std;

const int MAX = 100;

vector<int> graph[MAX];
bool visited[MAX];

void dfs(int start) {

    stack<int> s;
    s.push(start);

    while (!s.empty()) {

        int curr = s.top();
        s.pop();

        if (!visited[curr]) {

            visited[curr] = true;
            cout << curr << " ";

            #pragma omp parallel for
            for (int i = 0; i < graph[curr].size(); i++) {

                int adj = graph[curr][i];

                if (!visited[adj]) {

                    #pragma omp critical
                    s.push(adj);
                }
            }
        }
    }
}

int main() {

    int n, m, start;
    cout << "Enter nodes, edges and start node:\n";
    cin >> n >> m >> start;

    cout << "Enter edges:\n";

    for (int i = 0; i < m; i++) {

        int u, v;
        cin >> u >> v;

        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    #pragma omp parallel for
    for (int i = 0; i < n; i++)
        visited[i] = false;

    cout << "\nDFS Traversal:\n";
    dfs(start);

    return 0;
}
//Bubble Sort-hpc3

#include <iostream>
#include <omp.h>
#include <ctime>

using namespace std;

void bubbleSort(int a[], int n)
{
    for(int i = 0; i < n; i++)
    {
        int first = i % 2;

        #pragma omp parallel for
        for(int j = first; j < n - 1; j += 2)
        {
            if(a[j] > a[j + 1])
            {
                int temp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = temp;
            }
        }
    }
}

int main()
{
    int a[10] = {10,9,8,7,6,5,4,3,2,1};
    int n = 10;

    cout << "Original Array:\n";

    for(int i = 0; i < n; i++)
        cout << a[i] << " ";

    clock_t start = clock();

    bubbleSort(a, n);

    clock_t end = clock();

    cout << "\n\nSorted Array:\n";

    for(int i = 0; i < n; i++)
        cout << a[i] << " ";

    double time_taken =
    double(end - start) / double(CLOCKS_PER_SEC);

    cout << "\n\nExecution Time: "
         << time_taken << " seconds";

    return 0;
}
//MergeSort HPC4
#include <iostream>
#include <omp.h>
#include <ctime>

using namespace std;

void merge(int a[], int l, int m, int r)
{
    int n1 = m - l + 1;
    int n2 = r - m;

    int L[100], R[100];

    for(int i = 0; i < n1; i++)
        L[i] = a[l + i];

    for(int j = 0; j < n2; j++)
        R[j] = a[m + 1 + j];

    int i = 0, j = 0, k = l;

    while(i < n1 && j < n2)
    {
        if(L[i] <= R[j])
            a[k++] = L[i++];
        else
            a[k++] = R[j++];
    }

    while(i < n1)
        a[k++] = L[i++];

    while(j < n2)
        a[k++] = R[j++];
}

void mergeSort(int a[], int l, int r)
{
    if(l < r)
    {
        int m = (l + r) / 2;

        #pragma omp parallel sections
        {
            #pragma omp section
            mergeSort(a, l, m);

            #pragma omp section
            mergeSort(a, m + 1, r);
        }

        merge(a, l, m, r);
    }
}

int main()
{
    int n = 10;

    int a[10] = {10,9,8,7,6,5,4,3,2,1};

    cout << "Original Array:\n";

    for(int i = 0; i < n; i++)
        cout << a[i] << " ";

    clock_t start = clock();

    mergeSort(a, 0, n - 1);

    clock_t end = clock();

    cout << "\n\nSorted Array:\n";

    for(int i = 0; i < n; i++)
        cout << a[i] << " ";

    double time_taken =
    double(end - start) / double(CLOCKS_PER_SEC);

    cout << "\n\nExecution Time: "
         << time_taken << " seconds";

    return 0;
}  
//MinMaxSum-HPC5
PR HPC 5

#include <iostream>
#include <omp.h>
#include <climits>

using namespace std;

int main()
{
    int n;

    cout << "Enter number of elements: ";
    cin >> n;

    int arr[100];

    cout << "Enter elements:\n";

    for(int i = 0; i < n; i++)
        cin >> arr[i];

    int min_val = INT_MAX;
    int max_val = INT_MIN;
    int sum = 0;

    #pragma omp parallel for reduction(min:min_val)
    for(int i = 0; i < n; i++)
    {
        if(arr[i] < min_val)
            min_val = arr[i];
    }

    #pragma omp parallel for reduction(max:max_val)
    for(int i = 0; i < n; i++)
    {
        if(arr[i] > max_val)
            max_val = arr[i];
    }

    #pragma omp parallel for reduction(+:sum)
    for(int i = 0; i < n; i++)
    {
        sum += arr[i];
    }

    double avg = (double)sum / n;

    cout << "\nMinimum Value: " << min_val;
    cout << "\nMaximum Value: " << max_val;
    cout << "\nSum: " << sum;
    cout << "\nAverage: " << avg;

    return 0;
}
//Bostonhouse-DL1
#Step 1: Import Libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense



from google.colab import files

uploaded = files.upload()



#Step 2: Load Dataset
# Load dataset
df = pd.read_csv("boston_house_prices.csv")

# Remove quotes from column names (important for your dataset)
df.columns = df.columns.str.replace('"', '')

# Display first 5 rows
df.head()



#Step 3: Split Features and Target
X = df.drop("MEDV", axis=1)   # Features
y = df["MEDV"]                # Target

print(X.shape, y.shape)




#Step 4: Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)



#Step 5: Feature Scaling
scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)



model = Sequential()
model.add(Dense(1, input_shape=(X_train.shape[1],), activation='linear'))

model.compile(
    optimizer='adam',
    loss='mse',
    metrics=['mae']
)

history = model.fit(
    X_train, y_train,
    epochs=100,
    validation_split=0.05,
    verbose=1
)



#Step 6: Build Deep Neural Network
model = Sequential()

# Single neuron → behaves like linear regression
model.add(Dense(1, input_shape=(X_train.shape[1],), activation='linear'))

model.compile(
    optimizer='adam',
    loss='mse',
    metrics=['mae']
)

model.summary()



#Step 7: Train Model
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=16,
    validation_split=0.2,
    verbose=1
)



#Step 8: Evaluate Model
loss, mae = model.evaluate(X_test, y_test)

print("Test Loss (MSE):", loss)
print("Test MAE:", mae)



#Step 9: Predictions
y_pred = model.predict(X_test)

# Compare actual vs predicted
for i in range(5):
    print(f"Actual: {y_test.iloc[i]:.2f} | Predicted: {y_pred[i][0]:.2f}")



#Step 10: Plot Training Graphs
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.legend()
plt.title("Loss Graph")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.show()

IMDB_Sentiment-DL2

import numpy as np
import pandas as pd

from keras.datasets import imdb
(X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=10000) # you may take top 10,000 word frequently review of movies
#consolidating data for EDA(exploratory data analysis: involves gathering all the relevant data into one place and preparing it for analysis )
data = np.concatenate((X_train, X_test), axis=0)
label = np.concatenate((y_train, y_test), axis=0)

print("Review is ",X_train[5]) # series of no converted word to vocabulory associated with index
print("Review is ",y_train[5]) # 0 indicating a negative review and 1 indicating a positive review.

vocab=imdb.get_word_index() #The code you provided retrieves the word index for the IMDB dataset
print(vocab) 

data
label #label is a numpy array that contains all the sentiment labels from the IMDB dataset, both the training and testing sets.0 indicates a negative review and 1 indicates a positive review.

X_train.shape
X_test.shape
y_train
y_test

def vectorize(sequences, dimension = 10000):
  # Create an all-zero matrix of shape (len(sequences), dimension)
    results = np.zeros((len(sequences), dimension))
    for i, sequence in enumerate(sequences):
        results[i, sequence] = 1
    return results

# Now we split our data into a training and a testing set. 
# The training set will contain  reviews and the testing set 

test_x = data[:10000]
test_y = label[:10000]
train_x = data[10000:]
train_y = label[10000:]

test_y

train_x

train_y

print("Categories:", np.unique(label))
print("Number of unique words:", len(np.unique(np.hstack(data))))

length = [len(i) for i in data]
print("Average Review length:", np.mean(length))
print("Standard Deviation:", round(np.std(length)))

print("Label:", label[0])

print(data[0])

index

reverse_index

decoded


#Adding sequence to data
# Vectorization is the process of converting textual data into numerical vectors and is a process that is usually applied once the text is cleaned.
data = vectorize(data)
label = np.array(label).astype("float32")

data

import seaborn as sns #seaborn is a popular Python visualization library that is built on top of Matplotlib and provides a high-level interface for creating informative and attractive statistical graphics.
sns.set(color_codes=True)
import matplotlib.pyplot as plt # %matplotlib to display Matplotlib plots inline with the notebook
%matplotlib inline 

labelDF=pd.DataFrame({'label':label})
sns.countplot(x='label', data=labelDF)

# Creating train and test data set
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(data,label, test_size=0.20, random_state=1)

X_train.shape

X_test.shape

# Let's create sequential model,In deep learning, a Sequential model is a linear stack of layers, where you can simply add layers one after the other

from keras.utils import to_categorical
from keras import models
from keras import layers

model = models.Sequential()
# Input - Layer
# Note that we set the input-shape to 10,000 at the input-layer because our reviews are 10,000 integers long.
# The input-layer takes 10,000 as input and outputs it with a shape of 50.
model.add(layers.Dense(50, activation = "relu", input_shape=(10000, )))
# Hidden - Layers
# Please note you should always use a dropout rate between 20% and 50%. # here in our case 0.3 means 30% dropout we are using dropout to prevent overfitting. 
# By the way, if you want you can build a sentiment analysis without LSTMs(Long Short-Term Memory networks), then you simply need to replace it by a flatten layer:
model.add(layers.Dropout(0.3, noise_shape=None, seed=None))
model.add(layers.Dense(50, activation = "relu")) #ReLU" stands for Rectified Linear Unit, and it is a commonly used activation function in neural networks. 
model.add(layers.Dropout(0.2, noise_shape=None, seed=None))
model.add(layers.Dense(50, activation = "relu"))
# Output- Layer
model.add(layers.Dense(1, activation = "sigmoid")) #adds another Dense layer to the model, but with a single neuron instead of 50,i.e. out put layer,it produces the output predictions of the model.
model.summary()

import tensorflow as tf #TensorFlow provides a wide range of tools and features for data processing, model building, model training, and model evaluation.
callback = tf.keras.callbacks.EarlyStopping(monitor='loss', patience=3)

model.compile(
 optimizer = "adam",
 loss = "binary_crossentropy",
 metrics = ["accuracy"]
)

results = model.fit(

print(np.mean(results.history["val_accuracy"]))

# list all data in history
print(results.history.keys())
# summarize history for accuracy
plt.plot(results.history['accuracy']) #Plots the training accuracy of the model at each epoch.
plt.plot(results.history['val_accuracy']) #Plots the validation accuracy of the model at each epoch.
plt.title('model accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()
# summarize history for loss
plt.plot(results.history['loss'])
plt.plot(results.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()

model.predict(X_test)
