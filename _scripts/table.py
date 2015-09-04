#!/usr/bin/python
__author__ = 'rensholmer'
__created__ = '04/09/15'

import sys
import glob
import json
import copy

_sp = { 'al':0,'at':0,'ar':0,'br':0,
        'cp':0,'fv':1,'gm':1,'gr':0,
        'mt':1,'pt':1,'sl':0,'st':0,
        'ta':0,'vv':0,'os':0,'lj':0,
        'rc':1,'zm':0,'ph':1,'md':1,
        'cr':0}


def main():
	files = glob.glob('../json/*json')
	print 'name,file,num_genes,num_links,num_in_cluster,num_in_nfc,num_clusters,max_cluster'
	for f in files:
		filename = f.split('/')[-1]
		name = filename.split('.')[0]
		clusters = {}
		in_nfc = 0
		out_nfc = 0
		in_cluster = 0
		with open(f,'rU') as fh:
			dic = json.load(fh)
			num_genes = len(dic['nodes'])
			num_links = len([x for x in dic['links'] if 'block_score' in x])
			for node in dic['nodes']:
				cluster_id = node['clusters']['1.2']
				if cluster_id > 0:
					in_cluster += 1
				if cluster_id in clusters:
					clusters[cluster_id] += 1
				else:
					clusters[cluster_id] = 1
				if node['anchor'] == 1:
					if cluster_id > 0:
						anchor_in_cluster = 1
					else:
						anchor_in_cluster = 0
				if _sp[node['species']] == 1:
					in_nfc += 1
				else:
					out_nfc += 1
			fields = [name,filename,num_genes,num_links,in_cluster,in_nfc,len(clusters),max(clusters.values())]
			print ','.join([str(x) for x in fields])

if __name__ == '__main__':
	main()