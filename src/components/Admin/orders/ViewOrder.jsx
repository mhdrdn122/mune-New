import React, { useEffect } from 'react'
import { Modal, ModalBody } from 'react-bootstrap'

const ViewOrder = ({ show, onHide, order }) => {
    useEffect(() => {
        console.log(order)
    }, [order])

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header >
                <p className='w-full text-center'>تفاصيل المنتج</p>
            </Modal.Header>
            <ModalBody className='w-full'>
                <div className='flex flex-column w-full gap-5'>
                    <div className='self-center'>
                        <h3>{order?.name}</h3>
                    </div>
                    <div className='flex gap-4 w-full' dir="rtl">
                        <p>الكمية:</p>
                        <p>{order?.count}</p>
                    </div>
                    <div className='flex gap-4 w-full' dir="rtl">
                        <p>الحجم:</p>
                        <p>{order?.sizes ? JSON.parse(order?.components)?.name : "الحجم العادي"}</p>
                    </div>
                    <div className='flex gap-4 w-full' dir="rtl">
                        <p>العناصر المراد إزالتها:</p>
                        <div className='flex gap-1 flex-wrap w-full'>
                            {
                                order?.components && JSON.parse(order?.components)?.length > 0 ? JSON.parse(order?.components)?.map((comp) => <p>{comp?.name}</p>) :
                                    <p>لايوجد</p>
                            }
                        </div>
                    </div>
                    <div className='flex gap-4 w-full' dir="rtl">
                        <p>العناصر المراد إضافتها:</p>
                        <div className='flex gap-1 flex-wrap w-full'>
                            {
                                order?.toppings && JSON.parse(order?.toppings)?.length > 0 ? JSON.parse(order?.toppings)?.map((topping) => <p>{topping?.name},</p>) :
                                    <p>لايوجد</p>
                            }
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default ViewOrder
