import * as React from 'react';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { 
  PieChart, Pie, ResponsiveContainer,
  Tooltip, Cell, ComposedChart, XAxis,
  YAxis, Legend, CartesianGrid, Area,
  Bar, Line, Rectangle, Layer, Sankey
} from 'recharts';

interface MoleculeProps {
  label: string;
  children: React.ReactElement;
  isLarge?: boolean;
}

const CardCharts = ({ label, isLarge, children }: MoleculeProps) => {
  return (
    <Sheet sx={{ borderRadius: 5 }}>
      <Stack spacing={1}>
        <Typography
          startDecorator={<LocationOnRoundedIcon />}
          textColor="neutral.600"
          sx={{ p: 1 }}
        >
          {label}
        </Typography>
        <Box sx={isLarge ? { width: 900, height: 300 } : { width: 300, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </Box>
      </Stack>
    </Sheet>
  );
}

const colors = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]

const SankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  colors
}: any) => {
  const isOut = x + width + 6 > containerWidth;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colors[index % colors.length]}
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        stroke="#333"
      >
        {payload.name}
      </text>
      <text
        textAnchor={isOut ? "end" : "start"}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        stroke="#333"
        strokeOpacity="0.5"
      >
        {payload.value + "k"}
      </text>
    </Layer>
  );
}
const SankeyLink = ({sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
  colorGradients}: any) => {

const gradientID = `linkGradient${index}`;
  
  return (
    <Layer key={`CustomLink${index}`}>
      <defs>
        <linearGradient id={gradientID}>
          <stop offset="20%" stopColor={colorGradients[index].source} />
          <stop offset="80%" stopColor={colorGradients[index].target} />
        </linearGradient>
      </defs>
      <path
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        fill={`url(#${gradientID})`}
        strokeWidth="0"
      />
    </Layer>
  );
}
export const AppHomePage = () => {
  const activeDataset = [
    { name: 'Products', value: 18 },
    { name: 'Clients', value: 5 },
    { name: 'Invoices', value: 30 },
  ];
  const storageTopics = [
    { name: 'Contract A', value: 400 },
    { name: 'Contract B', value: 300 },
    { name: 'Contract C', value: 300 },
    { name: 'Contract D', value: 200 },
  ];
  const revenuCostData = [
    {
      "name": "Deals A",
      "cost": 10,
      "revenu": 18,
      "dataset": 5
    },
    {
      "name": "Deals B",
      "cost": 9,
      "revenu": 2,
      "dataset": 11
    },
    {
      "name": "Deals C",
      "cost": 18,
      "revenu": 30,
      "dataset": 14
    },
    {
      "name": "Deals D",
      "cost": 5,
      "revenu": 5,
      "dataset": 2
    },
  ]
  const pathForms = {
    "nodes": [
      {//0
        "name": "Forms"
      },
      {//1
        "name": "With reward"
      },
      {//2
        "name": "Without reward"
      },
      {//3
        "name": "Completed"
      },
      {//4
        "name": "Uncomplete"
      },
      /*{//5
        "name": "Wallet login"
      }*/
    ],
    "links": [
      {
        "source": 0,
        "target": 1,
        "value": 291741
      },
      {
        "source": 0,
        "target": 2,
        "value": 181741
      },
      {
        "source": 1,
        "target": 3,
        "value": 200000
      },
      {
        "source": 1,
        "target": 4,
        "value": 91741
      },
      {
        "source": 2,
        "target": 3,
        "value": 51741
      },
      {
        "source": 2,
        "target": 4,
        "value": 130000
      },
    ]
  };

  const numColors = colors.length;
  const colorGradients = pathForms.links.map((link) => {
    return {
      source: colors[link.source % numColors],
      target: colors[link.target % numColors]
    };
  });
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid>
        <CardCharts isLarge={true} label="Storage deals: cost and revenu in FIL">
          <ComposedChart width={730} height={250} data={revenuCostData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid stroke="#f5f5f5" />
            <Area type="monotone" dataKey="revenu" fill="#bdcf32" stroke="#87bc45" />
            <Bar dataKey="cost" barSize={20} fill="#ea5545" />
            <Line type="monotone" dataKey="dataset" stroke="#27aeef" />
          </ComposedChart>
        </CardCharts>
      </Grid>
      <Grid>
        <CardCharts label="Active dataset">
          <PieChart width={400} height={300}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={activeDataset}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {
                activeDataset.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]}/>
                ))
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </CardCharts>
      </Grid>
      <Grid>
        <CardCharts label="Storage topics">
          <PieChart width={400} height={300}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={storageTopics}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
            {
              activeDataset.map((entry, index) => (
                <Cell key={`ad-${index}`} fill={colors[index]}/>
              ))
            }
            </Pie>
            <Tooltip />
          </PieChart>
        </CardCharts>
      </Grid>
      <Grid>
        <CardCharts isLarge label="Dataset revenu with rewards">
        <Sankey
          width={700}
          height={500}
          data={pathForms}
          margin={{ top: 20, bottom: 20 }}
          linkCurvature={0.61}
          iterations={0}
          link={<SankeyLink colorGradients={colorGradients} />}
          node={<SankeyNode containerWidth={700} colors={colors} />}
        >
          <Tooltip />
        </Sankey>
        </CardCharts>
      </Grid>
    </Grid>
    
  );
}
/**

Number of dataset available
Size of dataset per contracts
Total number of contracts held
Amount of reward redistributed from amount of sales received from sales in market


 */