import React from 'react'
import { Skeleton } from 'primereact/skeleton';

function SkeletonLoading({flag}) {
  return (
    <div className="card mt-10">
            <div className="border-round border-1 surface-border p-4">
                <ul className="m-0 p-0 list-none">
                <li className="mb-10">
                        <div className="flex">
                            {/* <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton> */}
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="mb-10">
                        <div className="flex">
                            {/* <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton> */}
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="mb-10">
                        <div className="flex">
                            {/* <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton> */}
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                            </div>
                        </div>
                    </li>
                    <li className="mb-10">
                        <div className="flex">
                            {/* <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton> */}
                            <div style={{ flex: '1' }}>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                                <Skeleton width="100%" className="mb-2 bg-gray-400 dark:bg-gray-500"></Skeleton>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
  )
}

export default SkeletonLoading
