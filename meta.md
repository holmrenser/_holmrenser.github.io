---
layout: post
title: Meta
permalink: /meta/
---
Click column headers to sort.
<div class="container">
<table id="metatable" class="table tablesorter table-striped">
	<thead>
		<tr>
			<th>Gene family</th>
			<th># genes</th>
			<th># links</th>
			<th># in clusters</th>
			<th># in NFC clade</th>
			<th># clusters</th>
			<th>Max cluster size</th>
		</tr>
	</thead>
	<tbody>
	{% for g in site.data.index %}
		<tr>
			<td>{{ g.name }}</td>
			<td>{{ g.num_genes }}</td>
			<td>{{ g.num_links }}</td>
			<td>{{ g.num_in_cluster }}</td>
			<td>{{ g.num_in_nfc }}</td>
			<td>{{ g.num_clusters }}</td>
			<td>{{ g.max_cluster }}</td>
		</tr>
	{% endfor %}
	</tbody>
</table>
</div>

