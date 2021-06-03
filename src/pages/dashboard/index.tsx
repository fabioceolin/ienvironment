import { Flex, SimpleGrid, Box, Text, theme } from "@chakra-ui/react"
import dynamic from  'next/dynamic'
import Head from 'next/head'
import { Header } from "../../components/Header"
import { Sidebar } from "../../components/Sidebar"
import { setupAPIClient } from "../../services/api"
import { withSSRAuth } from "../../utils/withSSRAuth"

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const options = {
  chart: {
    toolbar: {
      show: false.valueOf,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    }
  }
}

const series = [
  { name: 'series1', data: [31, 120, 10, 28, 61, 18, 109] }
]

export default function Dashboard() {
  return(
    <Flex direction="column" h="100vh">
      <Head>Dashboard</Head>
      <Header />

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        
        <SimpleGrid flex="1" gap="4" minChildWidth="320px" templateRows="auto 1fr" align="flex-start">
          <Box
            p={["6","8"]}
            bg="gray.800"
            shadow="0 0 20px rgba(0, 0, 0, 0.05)"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Inscritos da semana</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>
          <Box
            p="8"
            bg="gray.800"
            shadow="0 0 20px rgba(0, 0, 0, 0.05)"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Taxa de abertura</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>

        </SimpleGrid>
      </Flex>
    </Flex>
    )
}
export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("user/me");

  return {
    props: {},
  };
});
