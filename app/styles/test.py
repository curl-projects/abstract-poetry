%pip install pinecone-client
%pip install aiohttp
%pip install k_means_constrained
%pip install numpy==1.7

import pinecone
from sklearn.cluster import KMeans, DBSCAN
import numpy as np
import time
import requests
from itertools import chain
import matplotlib.pyplot as plt
import asyncio
import aiohttp
from aiohttp import ClientSession, ClientConnectorError
import json

doi = '10.1371/journal.pone.0264856'
references_list = [
  'd9c1d8c22fb83b8d632d6764abaced3228153565',
  'ebf8c07cc82b7bfae8d22c7791c5907bdb0d7881',
  '9a10828bb6e85d02fd2bcbe0b06999ea06ef044d',
  'f19d96fec5544fa22bfcd792bfc43c2ec7f3c1f4',
  'ffd2232bb1658e877ac350725d0f0a91725ea4fa',
  '64bd4b9f9a42403f6f699d59225cdacdd1eb60ef',
  'ce644b709724012340982b8836f972b99a4f89cc',
  '1618eb87cbd6fc655252f85fcc17b84b2e1db7d3',
  'c0cc41ef1ad0aa5142b96d63c8c42b1f80f5a39d',
  '853c695d5f6bfed3e9dbc9ada482dbe6506478e9',
]

references_list.append(doi)

urls = [f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}?fields=embedding" for paper_id in references_list]

headers = {
      "x-api-key": "VwBe8ulXdy6u1IHMEAkgu8mxRB7h6iNP7Aqy5XqU"
}

async def fetch_html(url: str, session: ClientSession, **kwargs):
    try:
        print("URL:", url)
        res = await session.request(method="GET", url=url, **kwargs)
    except ClientConnectorError as error:
        return (url, 404, error)
    return await res.read()

async def make_requests(urls: set, **kwargs) -> None:
    async with ClientSession() as session:
        tasks = []
        for url in urls:
            tasks.append(
                fetch_html(url=url, session=session, **kwargs)
            )
        results = await asyncio.gather(*tasks)
        return results

try:
    loop = asyncio.get_running_loop()
except RuntimeError:  # 'RuntimeError: There is no current event loop...'
    loop = None

if loop and loop.is_running():
    print('Async event loop already running. Adding coroutine to the event loop.')
    tsk = loop.create_task(make_requests(urls, headers=headers))
    # ^-- https://docs.python.org/3/library/asyncio-task.html#task-object
    # Optionally, a callback function can be executed when the coroutine completes
    tsk.add_done_callback(
        lambda t: print(f'Task done with result={t.result()}  << return val of main()'))

else:
    print('Starting new event loop')
    tsk = asyncio.run(make_requests(urls, headers=headers))

tsk.result()[0]
embedding_list = [json.loads(i)['embedding']['vector'] for i in tsk.result()]

results_list = []

pinecone.init(api_key="7b1da713-81bd-4c6e-9e9f-c6bace0fae47", environment="us-west1-gcp")
index = pinecone.Index("embedding-db")

for embedding in embedding_list:
    data = index.query(
        top_k=10,
        vector=embedding,
        include_values=True
    )
    results_list.extend(data['matches'])


vectors = [i['values'] for i in results_list]
dois = [i['id'] for i in results_list]

# KMeans
vectors_array = np.reshape(vectors, (len(vectors), 768))

kmeans = KMeans(n_clusters=10, random_state=0).fit(vectors_array)

doiDict = dict(zip(dois, list(map(int, list(kmeans.labels_)))))

data = doiDict
