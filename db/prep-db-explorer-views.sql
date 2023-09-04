-------------------------------------------------------
-- PREP DATA EXPLORER VIEWS                          --
-- by: Jeff Walker <jeff@walkerenvres.com>           --
-- updated: 2023-09-01                               --
-------------------------------------------------------

-- Step 1: create odm2.prep_basin
-- use shp2pgsql to convert basin shapefile, which should contain only one polygon
-- $ shp2pgsql prep-basin.shp public.prep_basin > prep-basin.sql
-- then import using psql
-- $ psql -h ... -p ... -u ... -d PREP -f prep-basin.sql

-- Step 2: create prep_stations_basins view
-- contains all stations within the prep basin
create materialized view odm2.prep_stations_basin as (
	select s.samplingfeatureid,
	       s.samplingfeaturecode,
	       s.samplingfeaturename,
	       s.samplingfeaturedescription,
	       st_x(s.featuregeometry) as longitude,
	       st_y(s.featuregeometry) as latitude
	from samplingfeatures s, public.prep_basin pb
	where st_x(s.featuregeometry) is not null
    and st_y(s.featuregeometry) is not null
    and st_within(s.featuregeometry, pb.geom)
);

-- Step 3: create prep_results_all view
-- this table includes results for ALL variables at stations within basin
create materialized view odm2.prep_results_all as (
	with tsv as (
		select resultid,
			   count(*) as n_values,
			   min(valuedatetime) as start,
			   max(valuedatetime) as end
		from timeseriesresultvalues
		where qualitycodecv <> 'Bad'
		      and datavalue <> 'NaN'
		group by resultid
	)
	select r.resultid,
		   sf.samplingfeatureid,
		   v.variabletypecv,
		   v.variableid,
		   v.variablenamecv,
		   u.unitsid,
		   u.unitsabbreviation,
		   tsv.n_values,
		   tsv.start,
		   tsv.end
	from results r
	left join featureactions fa on r.featureactionid=fa.featureactionid
	left join samplingfeatures sf on fa.samplingfeatureid=sf.samplingfeatureid
	left join variables v on r.variableid=v.variableid
	left join units u on r.unitsid=u.unitsid
	inner join tsv on r.resultid=tsv.resultid
	where tsv.n_values > 0
	  and sf.samplingfeatureid in (select samplingfeatureid from odm2.prep_stations_basin)
	  and v.variabletypecv in ('Water quality', 'Hydrology')
);

-- Step 4: create prep_variables view
-- identifies most common units for each variableid in prep_results_all
-- creates prep_variableid
create materialized view odm2.prep_variables as (
	with rv as (
		select variabletypecv,
			   variablenamecv,
			   unitsid,
			   unitsabbreviation,
			   sum(n_values) as n_values
		from odm2.prep_results_all
		group by variabletypecv, variablenamecv, unitsid, unitsabbreviation
	), rv_rank as (
		select *, rank() over (partition by variabletypecv, variablenamecv order by n_values desc) as rank
		from rv
		order by variablenamecv
	)
	select row_number() over () as prep_variableid,
	       variabletypecv,
		     variablenamecv,
	       unitsid,
	       unitsabbreviation,
				 variablenamecv in (
					'Blue-green algae (cyanobacteria), phycocyanin',
					'Chlorophyll a',
					'Chlorophyll a, corrected for pheophytin',
					'Chlorophyll a, uncorrected for pheophytin',
					'Coliform, fecal',
					'Enterococcus',
					'Escherichia Coli',
					'Oxygen, dissolved',
					'Oxygen, dissolved percent of saturation',
					'pH',
					'Salinity',
					'Specific conductance',
					'Chloride',
					'Chloride Total',
					'Nitrogen',
					'Nitrogen, dissolved organic',
					'Nitrogen, NH3',
					'Nitrogen, NH4',
					'Nitrogen, nitrate (NO3)',
					'Nitrogen, nitrite (NO2) + nitrate (NO3)',
					'Nitrogen, Particulate',
					'Nitrogen, total',
					'Nitrogen, total dissolved',
					'Nitrogen, total kjeldahl',
					'Phosphorus',
					'Phosphorus As P Dissolved',
					'Phosphorus As P Total',
					'Phosphorus, organic',
					'Phosphorus, phosphate (PO4)',
					'Solids, Dissolved Total',
					'Solids, Suspended Total',
					'Temperature',
					'Turbidity'
		   ) as variablecore
	from rv_rank rvr
	where rvr.rank=1
);

-- Step 5: create prep_results view
-- filters prep_results_all using prep_variables to only include results with
--   the most common units for each variable
-- groups results by prep_variableid (distinct variablenamecv, unitsid)
create materialized view odm2.prep_results as (
	with rv as (
		select r.*, v.prep_variableid
		from odm2.prep_results_all r
		inner join odm2.prep_variables v
		   on r.variabletypecv=v.variabletypecv
		  and r.variablenamecv=v.variablenamecv
		  and r.unitsid=v.unitsid
	), rvs as (
		select rv.samplingfeatureid,
			   prep_variableid,
			   sum(n_values) as n_values,
		       min(rv.start) as start,
		       max(rv.end) as end
		from rv
		group by rv.samplingfeatureid, prep_variableid
	)
	select row_number() over () as prep_resultid,
	  	   rvs.samplingfeatureid,
	       s.samplingfeaturecode,
	       s.samplingfeaturecode in (
			'GRBAP',
			'GRBCL',
			'GRBLR',
			'GRBCML',
			'GRBGB',
			'GRBGBE',
			'GRBGBW',
			'GRBOR',
			'GRBSF',
			'GRBSQ',
			'GRBULB',
			'GRBUPR',
			'HHHR',
			'02-GWR',
			'05-SFR',
			'07-CCH',
			'05-OYS',
			'05-LMP',
			'09-EXT',
			'05-BLM',
			'02-WNC'
		   ) as samplingfeaturecore,
	   rvs.prep_variableid,
	   rvs.start,
	   rvs.end,
	   rvs.n_values
	from rvs
	left join samplingfeatures s on rvs.samplingfeatureid=s.samplingfeatureid
);

-- Step 6: create prep_results view
-- filters stations within basin having at least one set of results
create materialized view odm2.prep_stations as (
	select *
	from odm2.prep_stations_basin sb
	where samplingfeatureid in (select distinct samplingfeatureid from odm2.prep_results)
);

