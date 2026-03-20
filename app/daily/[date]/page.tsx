import DateStepper from '@/components/DateStepper';
import SymptomsForm from '@/components/SymptomsForm';

export default async function Daily(props: { params: Promise<{ date: string }> }) {
    const { date } = await props.params; // Get the date from the URL parameters

    return(
        <div className='box-border flex flex-col items-center'>
            <div className='flex max-w-3xl w-full mb-5'>
                <h1 className='font-bold text-2xl'>Log Your Symptoms</h1>
            </div>
            <DateStepper date={date} />
            <SymptomsForm date={date} />
        </div>
    );
}